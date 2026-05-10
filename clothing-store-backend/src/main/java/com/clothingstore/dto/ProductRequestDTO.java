package com.clothingstore.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequestDTO {
    @NotBlank(message = "Product name must not be blank")
    private String name;
    @NotNull(message = "Cost price must not be null")
    @DecimalMin(value = "0.01", message = "Cost price must be at least 0.01")
    private BigDecimal costPrice;
    @NotNull(message = "Sale price must not be null")
    @DecimalMin(value = "0.01", message = "Sale price must be at least 0.01")
    private BigDecimal salePrice;
    private Long categoryId;
    private List<ProductVariantDTO> variants;
}
