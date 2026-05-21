package com.HS.Repository;

import com.HS.modal.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DealRepository extends JpaRepository<Deal,Long> {

    List<Deal> findByCategoryId(Long categoryId);

    @Query("""
SELECT d FROM Deal d
WHERE d.category.id = :categoryId
AND (:color IS NULL OR d.color IS NULL OR LOWER(d.color) = LOWER(:color))
AND (:minPrice IS NULL OR (d.sellingPrice IS NOT NULL AND d.sellingPrice >= :minPrice))
AND (:maxPrice IS NULL OR (d.sellingPrice IS NOT NULL AND d.sellingPrice <= :maxPrice))
AND (:mindiscount IS NULL OR (d.discount IS NOT NULL AND d.discount >= :mindiscount))
""")
    List<Deal> filterDeals(
            @Param("categoryId") Long categoryId,
            @Param("color") String color,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("mindiscount") Integer mindiscount
    );
}
