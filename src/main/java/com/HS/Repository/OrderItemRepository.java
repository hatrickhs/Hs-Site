package com.HS.Repository;

import com.HS.domine.PaymentStatus;
import com.HS.modal.Order;
import com.HS.modal.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

    @Query("""
SELECT COALESCE(SUM(i.sellingPrice * i.quantity), 0)
FROM OrderItem i
WHERE i.sellerId = :sellerId
AND i.order.orderStatus = com.HS.modal.OrderStatus.DELIVERED
""")
    Long getTotalSales(@Param("sellerId") Long sellerId);

    @Query("""
SELECT COALESCE(SUM(i.sellingPrice * i.quantity), 0)
FROM OrderItem i
WHERE i.sellerId = :sellerId
AND i.order.orderStatus = com.HS.modal.OrderStatus.DELIVERED
""")
    Long getTotalEarnings(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(COUNT(o), 0) FROM Order o WHERE o.sellerId = :sellerId")
    Integer getTotalOrders(@Param("sellerId") Long sellerId);

    @Query("""
SELECT COALESCE(SUM(i.taxAmount), 0)
FROM OrderItem i
WHERE i.seller.id = :sellerId
AND i.order.orderStatus = com.HS.modal.OrderStatus.DELIVERED
""")
    Double getTotalTax(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(COUNT(o), 0) FROM Order o WHERE o.sellerId = :sellerId AND o.orderStatus = com.HS.modal.OrderStatus.CANCELLED")
    Integer getCanceledOrders(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = :status")
    Long getTotalRefunds(@Param("status") PaymentStatus status);

    @Query("SELECT COALESCE(COUNT(t), 0) FROM Transaction t WHERE t.seller.id = :sellerId")
    Integer getTotalTransactions(@Param("sellerId") Long sellerId);
}
