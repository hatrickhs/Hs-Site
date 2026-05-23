//package com.HS.modal;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@EqualsAndHashCode
//public class Deal {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    private Integer discount;
//
//    private String image;
//
//    @OneToOne
//    private HomeCategory category;
//
//    public Deal(Long id, Integer discount, HomeCategory category) {
//        this.id = id;
//        this.discount = discount;
//        this.category = category;
//    }
//
//
//}

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
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String color;

    private Integer discount;

    @Column(name = "mrp_price")
    private Integer mrpPrice;

    @Column(name = "selling_price")
    private Integer sellingPrice;

    @ElementCollection
    @CollectionTable(
            name = "deal_images",
            joinColumns = @JoinColumn(name = "deal_id")
    )
    @Column(name = "image")
    private List<String> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private HomeCategory category;

    @OneToMany(mappedBy = "deal", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    @Column(name = "expiry_time")
    private LocalDateTime expiryTime;


}
