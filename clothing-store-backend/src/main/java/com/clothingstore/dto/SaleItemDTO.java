package com.clothingstore.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SaleItemDTO {
    private Long variantId;
    private Long productId;
    private String productName;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
