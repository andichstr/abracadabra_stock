package com.clothingstore.dto;

import java.math.BigDecimal;

public interface DailySalesDTO {
    String getDate();
    BigDecimal getTotalAmount();
    Long getSaleCount();
}
