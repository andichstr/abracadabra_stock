package com.clothingstore.specification;

import com.clothingstore.model.Sale;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class SaleSpecification {

    public static Specification<Sale> saleDateFrom(LocalDate date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("saleDate"), date.atStartOfDay());
    }

    public static Specification<Sale> saleDateTo(LocalDate date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("saleDate"), date.atTime(LocalTime.MAX));
    }

    public static Specification<Sale> amountMin(BigDecimal amount) {
        if (amount == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("totalAmount"), amount);
    }

    public static Specification<Sale> amountMax(BigDecimal amount) {
        if (amount == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("totalAmount"), amount);
    }
}
