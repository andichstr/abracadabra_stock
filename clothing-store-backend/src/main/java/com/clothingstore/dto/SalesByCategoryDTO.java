package com.clothingstore.dto;

import java.math.BigDecimal;

public interface SalesByCategoryDTO {
    String getCategoryName();
    BigDecimal getTotalAmount();
    Long getSaleCount();
}
