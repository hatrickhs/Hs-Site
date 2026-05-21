package com.HS.Controller;

import com.HS.Service.SellerService;
import com.HS.Service.Service.CreateProductRequest;
import com.HS.Service.Service.ProductService;
import com.HS.exception.ProductException;
import com.HS.exception.SellerException;
import com.HS.modal.Product;
import com.HS.modal.Seller;
import jdk.jshell.spi.ExecutionControl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers/products")
public class SellerProductController {

    private final ProductService productService;
    private final SellerService sellerService;

    @GetMapping()
    public ResponseEntity<List<Product>> getProductBySellerId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        System.out.println("error"+jwt);

        Seller seller = sellerService.getSellerProfile(jwt);

       List<Product> products = productService.getProductBySellerId(seller.getId());

        return new ResponseEntity<>(products, HttpStatus.CREATED);
    }


    @PostMapping()
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductRequest request,

            @RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);

        Product product = productService.createProduct(request, seller);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) throws ProductException {
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody Product product) throws ProductException {
try {
    Product updatedProduct = productService.updateProduct(productId, product);
    return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
} catch (ProductException e) {
    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}


        }
    }



