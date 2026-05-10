package com.clothingstore.service;

import com.clothingstore.constants.ErrorMessages;
import com.clothingstore.dto.ProductRequestDTO;
import com.clothingstore.dto.ProductResponseDTO;
import com.clothingstore.dto.ProductVariantDTO;
import com.clothingstore.dto.ProductVariantScanDTO;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.mapper.ProductMapper;
import com.clothingstore.model.Product;
import com.clothingstore.model.ProductVariant;
import com.clothingstore.repository.CategoryRepository;
import com.clothingstore.repository.ProductRepository;
import com.clothingstore.repository.ProductVariantRepository;
import com.clothingstore.repository.SaleItemRepository;
import com.clothingstore.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService implements GenericService<ProductResponseDTO, ProductRequestDTO, Long> {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> findAll(Pageable pageable) {
        return findAll(null, null, null, null, null, null, null, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> findAll(Long categoryId, LocalDate dateFrom, LocalDate dateTo,
                                            BigDecimal priceMin, BigDecimal priceMax,
                                            String size, String color, Pageable pageable) {
        Specification<Product> spec = buildSpec(categoryId, dateFrom, dateTo, priceMin, priceMax, size, color);
        Page<Product> page = spec != null
                ? productRepository.findAll(spec, pageable)
                : productRepository.findAll(pageable);
        return page.map(productMapper::toResponse);
    }

    private Specification<Product> buildSpec(Long categoryId, LocalDate dateFrom, LocalDate dateTo,
                                              BigDecimal priceMin, BigDecimal priceMax,
                                              String size, String color) {
        boolean hasFilters = categoryId != null || dateFrom != null || dateTo != null
                || priceMin != null || priceMax != null
                || (size != null && !size.isBlank())
                || (color != null && !color.isBlank());
        if (!hasFilters) return null;
        return Specification
                .where(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.entryDateFrom(dateFrom))
                .and(ProductSpecification.entryDateTo(dateTo))
                .and(ProductSpecification.salePriceMin(priceMin))
                .and(ProductSpecification.salePriceMax(priceMax))
                .and(ProductSpecification.hasSize(size))
                .and(ProductSpecification.hasColorLike(color));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO findById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.PRODUCT_NOT_FOUND + id));
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO findByQrCode(String qrCode) {
        return productRepository.findByQrCode(qrCode)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.PRODUCT_NOT_FOUND_QR + qrCode));
    }

    @Override
    @Transactional
    public ProductResponseDTO create(ProductRequestDTO dto) {
        Product p = productMapper.toEntity(dto);
        p.setQrCode(UUID.randomUUID().toString());
        p.setEntryDate(LocalDate.now());
        if (dto.getCategoryId() != null) {
            p.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.CATEGORY_NOT_FOUND + dto.getCategoryId())));
        }
        Product saved = productRepository.save(p);
        applyVariants(saved, dto.getVariants());
        return productMapper.toResponse(productRepository.save(saved));
    }

    @Override
    @Transactional
    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.PRODUCT_NOT_FOUND + id));
        productMapper.updateEntity(dto, product);
        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.CATEGORY_NOT_FOUND + dto.getCategoryId())));
        } else {
            product.setCategory(null);
        }
        product.getVariants().clear();
        applyVariants(product, dto.getVariants());
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(ErrorMessages.PRODUCT_NOT_FOUND + id);
        }
        if (saleItemRepository.existsByProductVariantProductId(id)) {
            throw new IllegalStateException(ErrorMessages.PRODUCT_HAS_SALES + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public ProductVariantScanDTO findVariantByQrCode(String qrCode) {
        ProductVariant v = variantRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.VARIANT_NOT_FOUND_QR + qrCode));
        Product p = v.getProduct();
        return new ProductVariantScanDTO(v.getId(), v.getQrCode(), v.getSize(), v.getColor(),
                v.getStockQuantity(), v.getImageUrl(), p.getId(), p.getName(), p.getSalePrice());
    }

    private void applyVariants(Product product, List<ProductVariantDTO> variantDTOs) {
        if (variantDTOs == null || variantDTOs.isEmpty()) return;
        for (ProductVariantDTO dto : variantDTOs) {
            ProductVariant v = new ProductVariant();
            v.setProduct(product);
            v.setSize(dto.getSize());
            v.setColor(dto.getColor());
            v.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0);
            v.setImageUrl(dto.getImageUrl());
            v.setQrCode(UUID.randomUUID().toString());
            product.getVariants().add(v);
        }
    }
}
