package com.HS.modal;

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
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Double amount;

    private String paymentMethod;

    private String paymentStatus;

    @ManyToOne
    private Order order;

    @ManyToOne
    private  User customer;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();

    @ManyToOne
    private Seller seller;

    private LocalDateTime date = LocalDateTime.now();

}
