package com.clothingstore.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Long categoryId;
    private String categoryName;
    private String size;
    private String color;
    private LocalDate entryDate;
    private String imageUrl;
    private String qrCode;
}
