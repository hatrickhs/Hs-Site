package com.HS.modal;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> cartItems = new HashSet<>();

    private double totalSellingPrice;
    private int totalItem;
    private int totalMrpPrice;
    private int discount;
    private String couponCode;
    private double couponDiscount;
    // Cart.java
    public double getTotalPrice() {
        return cartItems.stream()
                .mapToDouble(item -> {
                    if (item.getSellingPrice() != null) {
                        return item.getSellingPrice() * item.getQuantity();
                    } else if (item.getMrpPrice() != null) {
                        return item.getMrpPrice() * item.getQuantity();
                    } else {
                        return 0;
                    }
                })
                .sum();
    }

}
