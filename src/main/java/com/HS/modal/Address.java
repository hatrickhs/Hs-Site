package com.HS.modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

    private String name;

    @Column(nullable = true)
    private  String locality;

    private String address;

    private String city;

    @Column(nullable = true)
    private String state;

    private String pinCode;

    private String mobile;

}
