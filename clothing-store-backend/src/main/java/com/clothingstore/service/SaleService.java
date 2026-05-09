package com.clothingstore.service;

import com.clothingstore.dto.SaleItemDTO;
import com.clothingstore.dto.SaleRequestDTO;
import com.clothingstore.dto.SaleResponseDTO;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.model.Product;
import com.clothingstore.model.Sale;
import com.clothingstore.model.SaleItem;
import com.clothingstore.repository.ProductRepository;
import com.clothingstore.repository.SaleRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

    public List<SaleResponseDTO> findAll(LocalDate dateFrom, LocalDate dateTo,
                                         BigDecimal amountMin, BigDecimal amountMax) {
        return saleRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (dateFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("saleDate"), dateFrom.atStartOfDay()));
            }
            if (dateTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("saleDate"), dateTo.atTime(LocalTime.MAX)));
            }
            if (amountMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("totalAmount"), amountMin));
            }
            if (amountMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("totalAmount"), amountMax));
            }
            query.orderBy(cb.desc(root.get("saleDate")));
            return cb.and(predicates.toArray(new Predicate[0]));
        }).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SaleResponseDTO findById(Long id) {
        return saleRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
    }

    @Transactional
    public SaleResponseDTO createSale(SaleRequestDTO request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Sale must contain at least one item.");
        }

        Sale sale = new Sale();
        sale.setSaleDate(LocalDateTime.now());
        BigDecimal total = BigDecimal.ZERO;

        for (SaleRequestDTO.CartItemDTO cartItem : request.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + cartItem.getProductId()));

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product '" + product.getName() +
                        "'. Available: " + product.getStockQuantity() +
                        ", requested: " + cartItem.getQuantity()
                );
            }

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            item.setUnitPrice(product.getSalePrice());

            sale.getItems().add(item);
            total = total.add(product.getSalePrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        sale.setTotalAmount(total);
        Sale saved = saleRepository.save(sale);
        return toDTO(saved);
    }

    private SaleResponseDTO toDTO(Sale sale) {
        SaleResponseDTO dto = new SaleResponseDTO();
        dto.setId(sale.getId());
        dto.setSaleDate(sale.getSaleDate());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setItems(sale.getItems().stream().map(item -> {
            SaleItemDTO itemDTO = new SaleItemDTO();
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setUnitPrice(item.getUnitPrice());
            itemDTO.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return itemDTO;
        }).collect(Collectors.toList()));
        return dto;
    }
}
