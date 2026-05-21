package com.HS.Controller;

import com.HS.Service.Service.ProductService;
import com.HS.exception.ProductException;
import com.HS.modal.Product;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product createdProduct = productService.saveProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }


    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId)
            throws ProductException {

        Product product = productService.findProductById(productId);
        return  new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProduct(
            @RequestParam(required = false)String query) {
        List<Product> products = productService.searchProducts(query);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(required = false)String category,
            @RequestParam(required = false)String brand,
            @RequestParam(required = false)String color,
            @RequestParam(required = false)String size,
            @RequestParam(required = false)String minPrice,
            @RequestParam(required = false)Integer maxPrice,
            @RequestParam(required = false)Integer mindiscount,
            @RequestParam(required = false)String sort,
            @RequestParam(required = false)String stock,
            @RequestParam(defaultValue = "0")Integer pageNumber){


        return new ResponseEntity<>(
                productService.getAllProducts(category,brand,color,
                        size,minPrice,maxPrice, mindiscount,
                        sort,stock,pageNumber), HttpStatus.OK);

    }

    @PutMapping("/{productId}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long productId,
            @RequestParam boolean inStock
    ) throws ProductException {

        Product product = productService.updateStock(productId, inStock);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

}
