package com.clothingstore.repository;

import com.clothingstore.dto.DailySalesDTO;
import com.clothingstore.dto.SalesByCategoryDTO;
import com.clothingstore.model.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    boolean existsByProductVariantProductId(Long productId);

    @Query(value = """
            SELECT COALESCE(c.name, 'Sin categoría') AS categoryName,
                   SUM(si.unit_price * si.quantity)  AS totalAmount,
                   COUNT(DISTINCT s.id)               AS saleCount
            FROM sale_items si
            JOIN product_variants pv ON si.product_variant_id = pv.id
            JOIN products          p  ON pv.product_id        = p.id
            LEFT JOIN categories   c  ON p.category_id        = c.id
            JOIN sales             s  ON si.sale_id           = s.id
            WHERE s.sale_date >= :from AND s.sale_date < :to
            GROUP BY c.name
            ORDER BY totalAmount DESC
            """, nativeQuery = true)
    List<SalesByCategoryDTO> findSalesByCategory(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query(value = """
            SELECT DATE_FORMAT(s.sale_date, '%Y-%m-%d')  AS date,
                   SUM(si.unit_price * si.quantity)      AS totalAmount,
                   COUNT(DISTINCT s.id)                  AS saleCount
            FROM sale_items si
            JOIN sales s ON si.sale_id = s.id
            WHERE s.sale_date >= :from
            GROUP BY DATE_FORMAT(s.sale_date, '%Y-%m-%d')
            ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m-%d') ASC
            """, nativeQuery = true)
    List<DailySalesDTO> findDailySales(@Param("from") LocalDateTime from);
}
