package com.clothingstore.service;

import com.clothingstore.dto.ProductDTO;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.model.Category;
import com.clothingstore.model.Product;
import com.clothingstore.repository.CategoryRepository;
import com.clothingstore.repository.ProductRepository;
import com.clothingstore.repository.SaleItemRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SaleItemRepository saleItemRepository;

    public List<ProductDTO> findAll(Long categoryId, LocalDate dateFrom, LocalDate dateTo,
                                   BigDecimal priceMin, BigDecimal priceMax,
                                   String size, String color) {
        return productRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (dateFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("entryDate"), dateFrom));
            }
            if (dateTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("entryDate"), dateTo));
            }
            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salePrice"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salePrice"), priceMax));
            }
            if (size != null && !size.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("size")), size.toLowerCase()));
            }
            if (color != null && !color.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("color")), "%" + color.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        }).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        return productRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public ProductDTO findByQrCode(String qrCode) {
        return productRepository.findByQrCode(qrCode)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with QR code: " + qrCode));
    }

    public ProductDTO create(ProductDTO dto) {
        Product product = fromDTO(dto, new Product());
        if (product.getQrCode() == null || product.getQrCode().isBlank()) {
            product.setQrCode(UUID.randomUUID().toString());
        }
        return toDTO(productRepository.save(product));
    }

    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        fromDTO(dto, product);
        return toDTO(productRepository.save(product));
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        if (saleItemRepository.existsByProductId(id)) {
            throw new IllegalStateException("Cannot delete product with id " + id + " because it has associated sales records.");
        }
        productRepository.deleteById(id);
    }

    private Product fromDTO(ProductDTO dto, Product product) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCostPrice(dto.getCostPrice());
        product.setSalePrice(dto.getSalePrice());
        product.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0);
        product.setSize(dto.getSize());
        product.setColor(dto.getColor());
        product.setEntryDate(dto.getEntryDate() != null ? dto.getEntryDate() : LocalDate.now());
        product.setImageUrl(dto.getImageUrl());
        product.setQrCode(dto.getQrCode());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
        return product;
    }

    public ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setCostPrice(p.getCostPrice());
        dto.setSalePrice(p.getSalePrice());
        dto.setStockQuantity(p.getStockQuantity());
        dto.setSize(p.getSize());
        dto.setColor(p.getColor());
        dto.setEntryDate(p.getEntryDate());
        dto.setImageUrl(p.getImageUrl());
        dto.setQrCode(p.getQrCode());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }
        return dto;
    }
}
