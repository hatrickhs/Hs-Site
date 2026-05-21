package com.HS.Service.ServiceImpl;
import com.HS.Repository.*;
import com.HS.Service.Service.OrderService;
import com.HS.domine.PaymentStatus;
import com.HS.modal.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;

    @Override
    public Order findOrderByIdForSeller(Long orderId, Long sellerId) throws Exception {
        Order order = findOrderById(orderId);
        if (!order.getSellerId().equals(sellerId))
        {
            throw new Exception("Order does not belong to this seller");
        }
        return order;
    }

    @Override
    public OrderItem getOrderItemByIdForSeller(Long orderItemId, Long sellerId) throws Exception {
        OrderItem item = getOrderItemById(orderItemId);
        if (!item.getSellerId().equals(sellerId)) {
            throw new Exception("Order Item does not belong to this seller");
        }
        return item;
    }

    @Override
    public List<Order> getOrdersBySellerId(Long id) throws Exception {
        return List.of();
    }


//    @Override
//    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {
//
////        Address address = addressRepository.save(shippingAddress);
//        Address address = shippingAddress;
//
//        Map<Long, List<CartItem>> itemsBySeller =
//                cart.getCartItems()
//                        .stream()
////                        .collect(Collectors.groupingBy(item -> {
////
////                            if (item.getProduct() != null) {
////                                return item.getProduct().getSeller().getId();
////                            } else if (item.getDeal() != null) {
////                                return 0L;
////                            }
////                            return 0L;
////                        }));
//
//                        .collect(Collectors.groupingBy(item -> {
//
//                            if (item.getProduct() != null && item.getProduct().getSeller() != null) {
//                                return item.getProduct().getSeller().getId();
//                            }
//
//                            else if (item.getDeal() != null && item.getDeal().getSeller() != null) {
//                                return item.getDeal().getSeller().getId();
//                            }
//
//                            throw new RuntimeException("Seller not found for cart item");
//                        }));
//
//        Set<Order> orders = new HashSet<>();
//
//        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
//            Long sellerId = entry.getKey();
//            List<CartItem> items = entry.getValue();
//
//            // CartItem fallback logic
//            for (CartItem item : items) {
//                if (item.getMrpPrice() == null) {
//                    item.setMrpPrice(item.getSellingPrice()); // fallback
//                }
//            }
//
//            int totalOrderPrice = items.stream()
//                    .mapToInt(item -> item.getSellingPrice() != null ? item.getSellingPrice() : 0)
//                    .sum();
//
//            int totalItem = items.stream().mapToInt(CartItem::getQuantity).sum();
//
//            if (totalOrderPrice <= 0) {
//                throw new RuntimeException("Order amount cannot be zero or null for seller " + sellerId);
//            }
//
//            double totalTax = items.stream()
//                    .mapToDouble(i -> {
//                        if (i.getTaxAmount() != null) {
//                            return i.getTaxAmount();
//                        } else {
//                            // fallback 5% GST
//                            return i.getSellingPrice() * i.getQuantity() * 0.05;
//                        }
//                    })
//                    .sum();
//
//            // Create Order
//            Order createdOrder = new Order();
//            createdOrder.setUser(user);
//            createdOrder.setSellerId(sellerId);
//            createdOrder.setTotalMrpPrice(totalOrderPrice);
//            createdOrder.setTotalSellingPrice(totalOrderPrice); // Razorpay amount
//            createdOrder.setTotalItems(totalItem);
//            createdOrder.setShippingAddress(address);
//            createdOrder.setPaymentDetails(new PaymentDetails());
//            createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);
//            createdOrder.setOrderStatus(OrderStatus.PENDING);
//            createdOrder.setOrderId(UUID.randomUUID().toString());
//            createdOrder.setTotalTax((long) totalTax);
//
//            Order savedOrder = orderRepository.save(createdOrder);
//            orders.add(savedOrder);
//
//            Seller seller = sellerRepository.findById(sellerId)
//                    .orElseThrow(() -> new RuntimeException("Seller not found"));
//
//            Transaction transaction = new Transaction();
//            transaction.setDate(LocalDateTime.now());
//            transaction.setCustomer(user);
//            transaction.setSeller(seller);
//            transaction.setAmount((double) totalOrderPrice);
//            transaction.setOrder(savedOrder);
//            transaction.setPaymentMethod("COD");
//            transaction.setPaymentStatus("PENDING");
//
//            transactionRepository.save(transaction);
//
//            // Save OrderItems
//            for (CartItem item : items) {
//                OrderItem orderItem = new OrderItem();
//                orderItem.setOrder(savedOrder);
//
//                orderItem.setQuantity(item.getQuantity());
//                orderItem.setSize(item.getSize());
//                orderItem.setUserId(item.getUserId());
//                orderItem.setSellingPrice(item.getSellingPrice());
//                orderItem.setSellerId(sellerId);
//
//                orderItem.setTaxAmount(
//                        item.getTaxAmount() != null
//                                ? item.getTaxAmount()
//                                : item.getSellingPrice() * item.getQuantity() * 0.05
//                );
//
//                // 🔥 PRODUCT OR DEAL HANDLING
//                if (item.getProduct() != null) {
//                    orderItem.setProduct(item.getProduct());
//                    orderItem.setDeal(null);
//                }
//                else if (item.getDeal() != null) {
//                    orderItem.setDeal(item.getDeal());
//                    orderItem.setProduct(null);
//                }
//
//                orderItemRepository.save(orderItem);
//                savedOrder.getOrderItems().add(orderItem);
//
//            }
//        }
//
//        return orders;
//    }

@Override
public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

    Address address = shippingAddress;

    Map<Long, List<CartItem>> itemsBySeller =
            cart.getCartItems()
                    .stream()
                    .collect(Collectors.groupingBy(item -> {

                        // 🟢 PRODUCT → seller exists
                        if (item.getProduct() != null && item.getProduct().getSeller() != null) {
                            return item.getProduct().getSeller().getId();
                        }

                        // 🟡 DEAL → ADMIN (NO seller)
                        else if (item.getDeal() != null) {
                            return 0L; // admin bucket
                        }

                        throw new RuntimeException("Seller not found for cart item");
                    }));

    Set<Order> orders = new HashSet<>();

    for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {

        Long sellerId = entry.getKey();
        List<CartItem> items = entry.getValue();

        // fallback
        for (CartItem item : items) {
            if (item.getMrpPrice() == null) {
                item.setMrpPrice(item.getSellingPrice());
            }
        }

        int totalOrderPrice = items.stream()
                .mapToInt(item -> item.getSellingPrice() != null ? item.getSellingPrice() : 0)
                .sum();

        int totalItem = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        if (totalOrderPrice <= 0) {
            throw new RuntimeException("Order amount cannot be zero for seller " + sellerId);
        }

        double totalTax = items.stream()
                .mapToDouble(i ->
                        i.getTaxAmount() != null
                                ? i.getTaxAmount()
                                : i.getSellingPrice() * i.getQuantity() * 0.05
                ).sum();

        // ================= ORDER =================
        Order createdOrder = new Order();
        createdOrder.setUser(user);
        createdOrder.setSellerId(sellerId == 0L ? null : sellerId);
        createdOrder.setTotalMrpPrice(totalOrderPrice);
        createdOrder.setTotalSellingPrice(totalOrderPrice);
        createdOrder.setTotalItems(totalItem);
        createdOrder.setShippingAddress(address);
        createdOrder.setPaymentDetails(new PaymentDetails());
        createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        createdOrder.setOrderStatus(OrderStatus.PENDING);
        createdOrder.setOrderId(UUID.randomUUID().toString());
        createdOrder.setTotalTax((long) totalTax);

        Order savedOrder = orderRepository.save(createdOrder);
        orders.add(savedOrder);

        // ================= TRANSACTION =================
        Transaction transaction = new Transaction();
        transaction.setDate(LocalDateTime.now());
        transaction.setCustomer(user);
        transaction.setAmount((double) totalOrderPrice);
        transaction.setOrder(savedOrder);
        transaction.setPaymentMethod("COD");
        transaction.setPaymentStatus("PENDING");

        // 🟢 only set seller if real seller order
        if (sellerId != 0L) {
            Seller seller = sellerRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            transaction.setSeller(seller);
        }

        transactionRepository.save(transaction);

        // ================= ORDER ITEMS =================
        for (CartItem item : items) {

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);

            orderItem.setQuantity(item.getQuantity());
            orderItem.setSize(item.getSize());
            orderItem.setUserId(item.getUserId());
            orderItem.setSellingPrice(item.getSellingPrice());
            orderItem.setSellerId(sellerId == 0L ? null : sellerId);

            orderItem.setTaxAmount(
                    item.getTaxAmount() != null
                            ? item.getTaxAmount()
                            : item.getSellingPrice() * item.getQuantity() * 0.05
            );

            // PRODUCT
            if (item.getProduct() != null) {
                orderItem.setProduct(item.getProduct());
                orderItem.setDeal(null);
            }

            // DEAL (ADMIN)
            else if (item.getDeal() != null) {
                orderItem.setDeal(item.getDeal());
                orderItem.setProduct(null);
            }

            orderItemRepository.save(orderItem);
            savedOrder.getOrderItems().add(orderItem);
        }
    }

    return orders;
}

    @Override
    public Order findOrderById(long id) throws Exception {
        return orderRepository.findById(id).orElseThrow(()-> new Exception("order not found..."));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUser_Id(userId);
    }

    @Override public List<Order> sellerOrder(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);

    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
        Order order=findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override public Order cancelOrder(Long orderId, User user) throws Exception {
        Order order=findOrderById(orderId);
        if (!user.getId().equals(order.getUser().getId())) {
            throw new Exception("you don't have access to this order");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepository.findById(id).orElseThrow(()-> new Exception("order item not exist ..."));
    }

    @Override
    @Transactional
    public void deleteOrderItem(Long orderId, Long orderItemId) throws Exception {

        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new Exception("Item not found"));

        if (!item.getOrder().getId().equals(orderId)) {
            throw new RuntimeException("Wrong order item");
        }

        // 🔥 important: break relation first
        item.setOrder(null);
        item.setProduct(null);
        item.setDeal(null);

        orderItemRepository.delete(item);
    }
}

