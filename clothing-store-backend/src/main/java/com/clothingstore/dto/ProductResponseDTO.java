package com.clothingstore.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private BigDecimal costPrice;
    private BigDecimal salePrice;
    private Long categoryId;
    private String categoryName;
    private LocalDate entryDate;
    private String qrCode;
    private List<ProductVariantDTO> variants;
}
