package com.clothingstore.specification;

import com.clothingstore.model.Sale;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class SaleSpecification {

    public static Specification<Sale> saleDateFrom(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.greaterThanOrEqualTo(root.get("saleDate"), date.atStartOfDay());
    }

    public static Specification<Sale> saleDateTo(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.lessThanOrEqualTo(root.get("saleDate"), date.atTime(LocalTime.MAX));
    }

    public static Specification<Sale> amountMin(BigDecimal amount) {
        return (root, query, cb) -> amount == null ? null : cb.greaterThanOrEqualTo(root.get("totalAmount"), amount);
    }

    public static Specification<Sale> amountMax(BigDecimal amount) {
        return (root, query, cb) -> amount == null ? null : cb.lessThanOrEqualTo(root.get("totalAmount"), amount);
    }
}
