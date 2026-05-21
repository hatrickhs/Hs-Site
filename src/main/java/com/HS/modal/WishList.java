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
@EqualsAndHashCode
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

   @ManyToOne
    private User user;

    @ManyToMany
    private Set<Product> products= new HashSet<>();

    @ManyToMany
    private Set<Deal> deals = new HashSet<>();


}
