package com.clothingstore.dto;

import lombok.Data;

import java.util.List;

@Data
public class SaleRequestDTO {
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private Long productId;
        private Integer quantity;
    }
}
