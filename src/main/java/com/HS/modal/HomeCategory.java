package com.HS.modal;

import com.HS.domine.HomeCategorySection;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class HomeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    private String name;

    private String image;

    private String categoryId;

    private HomeCategorySection section;

    private Integer discount = 0;
}

//
//@Entity
//public class HomeCategory {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String categoryId;
//    private String image;
//    private String name;
//
//    @Enumerated(EnumType.STRING)
//    private HomeCategorySection section;
//
//    public Long getId()
//
//}
