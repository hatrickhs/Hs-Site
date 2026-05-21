package com.HS.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private String size;

    private int quantity = 1;

    @Column(name = "mrp_price", nullable = false)
    private Integer mrpPrice;

    private Integer sellingPrice;

    private Integer taxAmount;

    @Column(name = "discount_amount")
    private Integer discountAmount = 0;

    private Long userId;

    private Long sellerId;

    @ManyToOne
    @JoinColumn(name = "deal_id")
    private Deal deal;

}
