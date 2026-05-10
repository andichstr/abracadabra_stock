package com.clothingstore.repository;

import com.clothingstore.model.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
    boolean existsByProductVariantProductId(Long productId);
}
