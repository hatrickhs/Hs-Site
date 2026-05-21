//package com.HS.modal;
//
//
//import com.HS.domine.PaymentStatus;
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@EqualsAndHashCode
//
//@Table(name = "orders")
//public class Order {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    @Column(name = "order_id")
//    private String orderId;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id", insertable = false, updatable = false)
//    private User user;
//
//    @Column(name = "user_id")
//    private Long userId;
//
//    @Column(name = "seller_id")
//    private Long sellerId;
//
//    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
//    private List<OrderItem> orderItems = new ArrayList<>();
//
//    @ManyToOne
//    @JoinColumn(name = "shipping_address_id")
//    private Address shippingAddress;
//
//    @Embedded
//    private PaymentDetails paymentDetails= new PaymentDetails();
//
//    private  double totalMrpPrice;
//
//    private Integer totalSellingPrice;
//
//    private Integer discount;
//
//    private OrderStatus orderStatus;
//
//    private int totalItems;
//
//    private Long totalTax ;
//
//    private PaymentStatus paymentStatus=PaymentStatus.PENDING;
//
//    private LocalDateTime orderData = LocalDateTime.now();
//    private LocalDateTime deliverDate = orderData.plusDays(7);
//
//    @ManyToOne
//    @JoinColumn(name = "transaction_id")
//    private Transaction transaction;
//
//
//
//}
//

package com.HS.modal;

import com.HS.domine.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "order_id")
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "seller_id")
    private Long sellerId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;

    @Embedded
    private PaymentDetails paymentDetails = new PaymentDetails();

    private double totalMrpPrice;

    private Integer totalSellingPrice;

    private Integer discount;

//    @Enumerated(EnumType.STRING)
//    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus = OrderStatus.PLACED;

    private int totalItems;

    private Long totalTax;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private LocalDateTime orderData = LocalDateTime.now();

    private LocalDateTime deliverDate;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    // ✅ FIX: lifecycle hook for date
    @PrePersist
    public void prePersist() {
        if (orderData == null) {
            orderData = LocalDateTime.now();
        }
        if (deliverDate == null) {
            deliverDate = orderData.plusDays(7);
        }

    }
}
