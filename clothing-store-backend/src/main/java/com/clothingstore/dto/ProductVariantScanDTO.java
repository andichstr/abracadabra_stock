package com.clothingstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductVariantScanDTO {
    private final Long variantId;
    private final String qrCode;
    private final String size;
    private final String color;
    private final Integer stockQuantity;
    private final String imageUrl;
    private final Long productId;
    private final String productName;
    private final BigDecimal salePrice;
}
