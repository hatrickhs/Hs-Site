package com.HS.Service.Service;

import com.HS.exception.ProductException;
import com.HS.modal.Product;
import com.HS.modal.Seller;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    public Product createProduct(CreateProductRequest req, Seller seller);

    // ⚠️ interface compatibility
    Product fidProductById(Long productId) throws ProductException;

    public void deleteProduct(Long productId) throws ProductException;
    public Product updateProduct(Long productId,Product product) throws ProductException;

//    Product fidProductById(Long productId) throws ProductException;

    Product findProductById(Long productId) throws ProductException;

    List<Product> searchProducts(String query);

    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            String minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    );

    List<Product> getProductBySellerId(Long sellerId);

    public Product saveProduct(Product product);

    Product updateStock(Long productId, boolean inStock) throws ProductException;

}
