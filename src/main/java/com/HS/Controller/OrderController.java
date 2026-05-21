//package com.HS.Controller;
//
//import com.HS.Repository.PaymentOrderRepository;
//import com.HS.Service.SellerService;
//import com.HS.Service.Service.*;
//import com.HS.domine.PaymentMethod;
//import com.HS.domine.USER_ROLE;
//import com.HS.modal.*;
//import com.HS.response.PaymentLinkResponse;
//import com.razorpay.PaymentLink;
//import jdk.jshell.spi.ExecutionControl;
//import lombok.RequiredArgsConstructor;
//import org.apache.tomcat.util.http.parser.Authorization;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Set;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/orders")
//public class OrderController {
//
//    private final OrderService orderService;
//    private final UserService userService;
//    private final CartService cartService;
//    private final SellerService sellerService;
//    private final SellerReportService sellerReportService;
//    private final PaymentService paymentService;
//    private final PaymentOrderRepository paymentOrderRepository;
//
//    @GetMapping("/seller")
//    public ResponseEntity<List<Order>> getSellerOrders(
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//
//        User user = userService.findUserByJwtToken(jwt);
//
//        if (user.getRole() != USER_ROLE.ROLE_SELLER) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//
//        List<Order> orders = orderService.getOrdersBySellerId(user.getId());
//
//        return ResponseEntity.ok(orders);
//    }
//
//
//    @GetMapping("/seller/{orderId}")
//    public ResponseEntity<Order> getSellerOrderById(
//            @PathVariable Long orderId,
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//
////        User user = userService.findUserByJwtToken(jwt);
//
//        String token = jwt.substring(7); // IMPORTANT: remove "Bearer "
//
//        User user = userService.findUserByJwtToken(token);
//        // Seller role இல்லனா access deny
//        if (user.getRole() != USER_ROLE.ROLE_SELLER) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//
//
//        Order order = orderService.findOrderByIdForSeller(orderId, user.getId());
//
//        return new ResponseEntity<>(order, HttpStatus.OK);
//    }
//
//
//    @GetMapping("/seller/item/{orderItemId}")
//    public ResponseEntity<OrderItem> getSellerOrderItemById(
//            @PathVariable Long orderItemId,
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//
//        User user = userService.findUserByJwtToken(jwt);
//
//        if (user.getRole() != USER_ROLE.ROLE_SELLER) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//
//        OrderItem orderItem =
//                orderService.getOrderItemByIdForSeller(orderItemId, user.getId());
//
//        return new ResponseEntity<>(orderItem, HttpStatus.OK);
//    }
//
//
////    @PostMapping()
////
////    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
////            @RequestBody Address shippingAddress,
////            @RequestParam PaymentMethod paymentMethod,
////            @RequestHeader("Authorization") String jwt
////    ) throws Exception {
////
////        User user = userService.findUserByJwtToken(jwt);
////        Cart cart = cartService.findUserCart(user);
////
////        System.out.println("Cart Items: " + cart.getCartItems());
////
////
////        // Orders create
////        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
////
////        // Payment amount check
////        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();
////        if (amount <= 0) {
////            throw new RuntimeException("Cannot proceed to payment: total amount is zero");
////        }
////
////        // Payment order create
////        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);
////
////        PaymentLinkResponse res = new PaymentLinkResponse();
////
////        // Razorpay or Stripe
////        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
////            PaymentLinkResponse payment = paymentService.createRazorpayPaymentLink(
////                    user, paymentOrder.getAmount(), paymentOrder.getId()
////            );
////
////            paymentOrder.setPaymentLinkId(payment.get("id"));
////            paymentOrderRepository.save(paymentOrder);
////
////            res.setPaymentLinkUrl(payment.get("short_url"));
////        } else {
////            String paymentUrl = paymentService.createStripePaymentLink(
////                    user, paymentOrder.getAmount(), paymentOrder.getId()
////            );
////            res.setPaymentLinkId(paymentUrl);
////        }
////
////        return new ResponseEntity<>(res, HttpStatus.OK);
////    }
//
//    @PostMapping()
//    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
//            @RequestBody Address shippingAddress,
//            @RequestParam PaymentMethod paymentMethod,
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//
//        User user = userService.findUserByJwtToken(jwt);
//        Cart cart = cartService.findUserCart(user);
//
//        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
//
//        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();
//        if (amount <= 0) throw new RuntimeException("Cannot proceed to payment: total amount is zero");
//
//        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);
//
//        PaymentLinkResponse res;
//
//        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
//            PaymentLinkResponse payment = paymentService.createRazorpayPaymentLink(
//                    user, paymentOrder.getAmount(), paymentOrder.getId()
//            );
//
//            res = new PaymentLinkResponse();
//            res.setPaymentLinkId(payment.getPaymentLinkId());
//            res.setPaymentLinkUrl(payment.getPaymentLinkUrl());
//
//        } else { // STRIPE
//            String paymentUrl = paymentService.createStripePaymentLink(
//                    user, paymentOrder.getAmount(), paymentOrder.getId()
//            );
//            res = new PaymentLinkResponse();
//            res.setPaymentLinkUrl(paymentUrl);
//        }
//
//        return new ResponseEntity<>(res, HttpStatus.OK);
//    }
//
//
//    @GetMapping("/user")
//    public ResponseEntity<List<Order>> userOrderHistoryHandler(
//            @RequestHeader("Authorization")
//            String jwt) throws Exception {
//
//        User user=userService.findUserByJwtToken(jwt);
//        List<Order> orders=orderService.usersOrderHistory(user.getId());
//        return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
//
//    }
//    @GetMapping("/{orderId}")
//    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId, @RequestHeader("Authorization")
//String jwt) throws Exception {
//
//        User user=userService.findUserByJwtToken(jwt);
//        Order orders=orderService.findOrderById(orderId);
//        return  new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
//    }
//
//    @GetMapping("/item/{orderItemId}")
//    public ResponseEntity<OrderItem>getOrderItemById(
//            @PathVariable long orderItemId, @RequestHeader("Authorization")
//            String jwt) throws Exception{
//        System.out.println(".......... controller");
//        User user = userService.findUserByJwtToken(jwt);
//        OrderItem orderItem=orderService.getOrderItemById(orderItemId);
//        return new ResponseEntity<>(orderItem,HttpStatus.ACCEPTED);
//    }
//
//    @PutMapping("{orderId}/cancel")
//    public ResponseEntity<Order> cancelOrder(
//            @PathVariable Long orderId,
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//        User user=userService.findUserByJwtToken(jwt);
//        Order order=orderService.cancelOrder(orderId,user);
//
//        Seller seller= sellerService.getSellerById(order.getSellerId());
//        SellerReport report=sellerReportService.getSellerReport(seller);
//
//        report.setCanceledOrders(report.getCanceledOrders()+1);
//        report.setTotalRefunds(report.getTotalRefunds()+order.getTotalSellingPrice());
//        sellerReportService.updateSellerReport(report);
//
//
//        return ResponseEntity.ok(order);
//    }
//}


package com.HS.Controller;

import com.HS.Repository.OrderItemRepository;
import com.HS.Repository.PaymentOrderRepository;
import com.HS.Service.SellerService;
import com.HS.Service.Service.*;
import com.HS.domine.PaymentMethod;
import com.HS.domine.USER_ROLE;
import com.HS.modal.*;
import com.HS.request.CreateOrderRequest;
import com.HS.response.PaymentLinkResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final CartService cartService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressService addressService;

    // ================= JWT FIX =================
    private String extractToken(String jwt) {
        return jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt;
    }

    // ================= SELLER ORDERS =================
    @GetMapping("/seller")
    public ResponseEntity<List<Order>> getSellerOrders(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(extractToken(jwt));

        if (user.getRole() != USER_ROLE.ROLE_SELLER) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<Order> orders = orderService.getOrdersBySellerId(user.getId());
        return ResponseEntity.ok(orders);
    }

    // ================= SELLER ORDER BY ID =================
    @GetMapping("/seller/{orderId}")
    public ResponseEntity<Order> getSellerOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(extractToken(jwt));

        if (user.getRole() != USER_ROLE.ROLE_SELLER) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Order order = orderService.findOrderByIdForSeller(orderId, user.getId());
        return ResponseEntity.ok(order);
    }

    // ================= SELLER ORDER ITEM =================
    @GetMapping("/seller/item/{orderItemId}")
    public ResponseEntity<OrderItem> getSellerOrderItemById(
            @PathVariable Long orderItemId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(extractToken(jwt));

        if (user.getRole() != USER_ROLE.ROLE_SELLER) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        OrderItem orderItem =
                orderService.getOrderItemByIdForSeller(orderItemId, user.getId());

        return ResponseEntity.ok(orderItem);
    }

    // ================= CREATE ORDER =================
//    @PostMapping()
//    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
//            @RequestBody Address shippingAddress,
//            @RequestParam PaymentMethod paymentMethod,
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//
//        User user = userService.findUserByJwtToken(extractToken(jwt));
//        Cart cart = cartService.findUserCart(user);
//
//        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
//
//        Long amount = orders.stream()
//                .mapToLong(Order::getTotalSellingPrice)
//                .sum();
//
//        if (amount <= 0)
//            throw new RuntimeException("Cannot proceed: amount is zero");
//
//        PaymentLinkResponse res = new PaymentLinkResponse();
//
//        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);
//
//        // ================= RAZORPAY =================
//        if (paymentMethod == PaymentMethod.RAZORPAY) {
//
//            PaymentLinkResponse payment =
//                    paymentService.createRazorpayPaymentLink(
//                            user,
//                            paymentOrder.getAmount(),
//                            paymentOrder.getId()
//                    );
//
//            res.setPaymentLinkId(payment.getPaymentLinkId());
//            res.setPaymentLinkUrl(payment.getPaymentLinkUrl());
//        }
//
//        // ================= STRIPE =================
//        else if (paymentMethod == PaymentMethod.STRIPE) {
//
//            String url = paymentService.createStripePaymentLink(
//                    user,
//                    paymentOrder.getAmount(),
//                    paymentOrder.getId()
//            );
//
//            res.setPaymentLinkUrl(url);
//        }
//
//        // ================= COD (IMPORTANT FIX) =================
//        else if (paymentMethod == PaymentMethod.CASH_ON_DELIVERY) {
//
//            paymentOrder.setStatus(com.HS.domine.PaymentOrderStatus.SUCCESS);
//            paymentOrderRepository.save(paymentOrder);
//
//            for (Order order : orders) {
//                order.setPaymentStatus(com.HS.domine.PaymentStatus.PENDING);
//            }
//
//            res.setPaymentLinkUrl("COD_ORDER_PLACED");
//        }
//
//        return new ResponseEntity<>(res, HttpStatus.OK);
//    }

    @PostMapping()
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
            @RequestBody CreateOrderRequest req,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(extractToken(jwt));

        Cart cart = cartService.findUserCart(user);

        Address shippingAddress =
                addressService.findById(req.getAddressId());

        Set<Order> orders =
                orderService.createOrder(user, shippingAddress, cart);

        Long amount = orders.stream()
                .mapToLong(Order::getTotalSellingPrice)
                .sum();

        if (amount <= 0)
            throw new RuntimeException("Cannot proceed: amount is zero");

        PaymentLinkResponse res = new PaymentLinkResponse();

        PaymentOrder paymentOrder =
                paymentService.createOrder(user, orders);

        if (paymentMethod == PaymentMethod.RAZORPAY) {

            PaymentLinkResponse payment =
                    paymentService.createRazorpayPaymentLink(
                            user,
                            paymentOrder.getAmount(),
                            paymentOrder.getId()
                    );

            res.setPaymentLinkId(payment.getPaymentLinkId());
            res.setPaymentLinkUrl(payment.getPaymentLinkUrl());

        } else if (paymentMethod == PaymentMethod.CASH_ON_DELIVERY) {

            paymentOrder.setStatus(
                    com.HS.domine.PaymentOrderStatus.SUCCESS
            );

            paymentOrderRepository.save(paymentOrder);

            res.setPaymentLinkUrl("COD_ORDER_PLACED");
        }

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // ================= USER ORDERS =================
    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistoryHandler(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(extractToken(jwt));

        List<Order> orders = orderService.usersOrderHistory(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // ================= ORDER BY ID =================
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        userService.findUserByJwtToken(extractToken(jwt));

        Order order = orderService.findOrderById(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    // ================= ORDER ITEM =================
    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemById(
            @PathVariable long orderItemId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        userService.findUserByJwtToken(extractToken(jwt));

        OrderItem orderItem = orderService.getOrderItemById(orderItemId);
        return new ResponseEntity<>(orderItem, HttpStatus.OK);
    }

    // ================= CANCEL ORDER =================
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(extractToken(jwt));

        Order order = orderService.cancelOrder(orderId, user);

        Seller seller = sellerService.getSellerById(order.getSellerId());
        SellerReport report = sellerReportService.getSellerReport(seller);

        report.setCanceledOrders(report.getCanceledOrders() + 1);
        report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());

        sellerReportService.updateSellerReport(report);

        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{orderId}/item/{orderItemId}")
    public ResponseEntity<String> deleteOrderItem(
            @PathVariable Long orderId,
            @PathVariable Long orderItemId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        System.out.println("🔥 DELETE API HIT");

        orderService.deleteOrderItem(orderId, orderItemId);

        return ResponseEntity.ok("Deleted successfully");
    }

}