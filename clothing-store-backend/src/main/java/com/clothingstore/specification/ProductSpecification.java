package com.clothingstore.specification;

import com.clothingstore.model.Product;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductSpecification {

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? null : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> entryDateFrom(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.greaterThanOrEqualTo(root.get("entryDate"), date);
    }

    public static Specification<Product> entryDateTo(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.lessThanOrEqualTo(root.get("entryDate"), date);
    }

    public static Specification<Product> salePriceMin(BigDecimal price) {
        return (root, query, cb) -> price == null ? null : cb.greaterThanOrEqualTo(root.get("salePrice"), price);
    }

    public static Specification<Product> salePriceMax(BigDecimal price) {
        return (root, query, cb) -> price == null ? null : cb.lessThanOrEqualTo(root.get("salePrice"), price);
    }

    public static Specification<Product> hasSize(String size) {
        return (root, query, cb) -> {
            if (size == null || size.isBlank()) return null;
            query.distinct(true);
            return cb.equal(cb.lower(root.join("variants", JoinType.INNER).get("size")), size.toLowerCase());
        };
    }

    public static Specification<Product> hasColorLike(String color) {
        return (root, query, cb) -> {
            if (color == null || color.isBlank()) return null;
            query.distinct(true);
            return cb.like(cb.lower(root.join("variants", JoinType.INNER).get("color")), "%" + color.toLowerCase() + "%");
        };
    }
}
