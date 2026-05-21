package com.HS.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateProductRequest {
    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private int quantity;
    private String color;
    private List<String> images;
    private List<String> sizes;
    private String category;
    private String category2;
    private String category3;


}
