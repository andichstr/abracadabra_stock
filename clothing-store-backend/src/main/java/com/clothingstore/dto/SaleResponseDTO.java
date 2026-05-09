package com.clothingstore.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleResponseDTO {
    private Long id;
    private LocalDateTime saleDate;
    private BigDecimal totalAmount;
    private List<SaleItemDTO> items;
}
