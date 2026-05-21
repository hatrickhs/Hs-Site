package com.HS.Service.Service;

import lombok.Data;

import java.util.List;

@Data
public class CreateProductRequest {
    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private String color;
    private List<String> images;
    private String category;
    private String category2;
    private String Category3;


    private String sizes;

    public int Quantity;

    private Boolean inStock;

}
