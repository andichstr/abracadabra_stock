package com.clothingstore.dto;

import lombok.Data;

@Data
public class ProductVariantDTO {
    private Long id;
    private String size;
    private String color;
    private Integer stockQuantity;
    private String imageUrl;
}
