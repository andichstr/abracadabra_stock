package com.clothingstore.service;

import com.clothingstore.constants.ErrorMessages;
import com.clothingstore.dto.SaleRequestDTO;
import com.clothingstore.dto.SaleResponseDTO;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.mapper.SaleMapper;
import com.clothingstore.model.Product;
import com.clothingstore.model.ProductVariant;
import com.clothingstore.model.Sale;
import com.clothingstore.model.SaleItem;
import com.clothingstore.repository.ProductVariantRepository;
import com.clothingstore.repository.SaleRepository;
import com.clothingstore.specification.SaleSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService implements GenericService<SaleResponseDTO, SaleRequestDTO, Long> {

    private final SaleRepository saleRepository;
    private final ProductVariantRepository variantRepository;
    private final SaleMapper saleMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponseDTO> findAll() {
        return findAll(null, null, null, null);
    }

    @Transactional(readOnly = true)
    public List<SaleResponseDTO> findAll(LocalDate dateFrom, LocalDate dateTo,
                                         BigDecimal amountMin, BigDecimal amountMax) {
        Specification<Sale> spec = Specification
                .where(SaleSpecification.saleDateFrom(dateFrom))
                .and(SaleSpecification.saleDateTo(dateTo))
                .and(SaleSpecification.amountMin(amountMin))
                .and(SaleSpecification.amountMax(amountMax));
        return saleRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "saleDate"))
                .stream().map(saleMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponseDTO findById(Long id) {
        return saleRepository.findById(id)
                .map(saleMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.SALE_NOT_FOUND + id));
    }

    @Override
    @Transactional
    public SaleResponseDTO create(SaleRequestDTO request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException(ErrorMessages.SALE_EMPTY_ITEMS);
        }

        Sale sale = new Sale();
        sale.setSaleDate(LocalDateTime.now());
        BigDecimal total = BigDecimal.ZERO;

        for (SaleRequestDTO.CartItemDTO cartItem : request.getItems()) {
            ProductVariant variant = variantRepository.findById(cartItem.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.VARIANT_NOT_FOUND + cartItem.getVariantId()));

            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                Product product = variant.getProduct();
                throw new IllegalArgumentException(
                        ErrorMessages.INSUFFICIENT_STOCK + product.getName() +
                        "' (" + variant.getSize() + " / " + variant.getColor() + ")" +
                        ". Available: " + variant.getStockQuantity() +
                        ", requested: " + cartItem.getQuantity()
                );
            }

            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            variantRepository.save(variant);

            Product product = variant.getProduct();
            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProductVariant(variant);
            item.setQuantity(cartItem.getQuantity());
            item.setUnitPrice(product.getSalePrice());

            sale.getItems().add(item);
            total = total.add(product.getSalePrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        sale.setTotalAmount(total);
        return saleMapper.toResponse(saleRepository.save(sale));
    }
}
