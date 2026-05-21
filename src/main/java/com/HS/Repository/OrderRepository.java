package com.HS.Repository;

import com.HS.domine.PaymentStatus;
import com.HS.modal.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {

    List<Order> findByUser_Id(Long userId);
    List<Order> findBySellerId(Long sellerId);
}
