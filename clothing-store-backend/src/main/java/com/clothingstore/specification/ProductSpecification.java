package com.clothingstore.specification;

import com.clothingstore.model.Product;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductSpecification {

    public static Specification<Product> hasCategory(Long categoryId) {
        if (categoryId == null) return null;
        return (root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> entryDateFrom(LocalDate date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("entryDate"), date);
    }

    public static Specification<Product> entryDateTo(LocalDate date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("entryDate"), date);
    }

    public static Specification<Product> salePriceMin(BigDecimal price) {
        if (price == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("salePrice"), price);
    }

    public static Specification<Product> salePriceMax(BigDecimal price) {
        if (price == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("salePrice"), price);
    }

    public static Specification<Product> hasSize(String size) {
        if (size == null || size.isBlank()) return null;
        return (root, query, cb) -> {
            query.distinct(true);
            return cb.equal(cb.lower(root.join("variants", JoinType.INNER).get("size")), size.toLowerCase());
        };
    }

    public static Specification<Product> hasColorLike(String color) {
        if (color == null || color.isBlank()) return null;
        return (root, query, cb) -> {
            query.distinct(true);
            return cb.like(cb.lower(root.join("variants", JoinType.INNER).get("color")), "%" + color.toLowerCase() + "%");
        };
    }
}
