package com.HS.Service.Service;

import com.HS.modal.*;

import java.util.List;
import java.util.Set;

public interface OrderService {
    Set<Order> createOrder(User user, Address ShippingAddress, Cart cart);

    Order findOrderById(long id) throws Exception;

    List<Order> usersOrderHistory(Long userId);

    List<Order> sellerOrder(Long sellerId);

    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;

    Order cancelOrder(Long orderId, User user) throws Exception;

    OrderItem getOrderItemById(Long id) throws Exception;

    Order findOrderByIdForSeller(Long orderId, Long sellerId) throws Exception;

    OrderItem getOrderItemByIdForSeller(Long orderItemId, Long sellerId) throws Exception;

    List<Order> getOrdersBySellerId(Long id) throws  Exception;

    void deleteOrderItem(Long orderId, Long orderItemId) throws Exception;

}
