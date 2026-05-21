////package com.HS.Service.ServiceImpl;
////
////
////import com.HS.Repository.CategoryRepository;
////import com.HS.Repository.ProductRepository;
////import com.HS.Service.Service.CreateProductRequest;
////import com.HS.Service.Service.ProductService;
////import com.HS.exception.ProductException;
////import com.HS.modal.Category;
////import com.HS.modal.Product;
////import com.HS.modal.Seller;
////import jakarta.persistence.criteria.Join;
////import jakarta.persistence.criteria.Predicate;
////import lombok.RequiredArgsConstructor;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.data.domain.Page;
////import org.springframework.data.domain.PageRequest;
////import org.springframework.data.domain.Pageable;
////import org.springframework.data.domain.Sort;
////import org.springframework.data.jpa.domain.Specification;
////import org.springframework.stereotype.Service;
////
////import java.time.LocalDateTime;
////import java.util.ArrayList;
////import java.util.List;
////import java.util.stream.Collectors;
////
////
////@Service
////@RequiredArgsConstructor
////public class ProductServiceImpl implements ProductService{
////
////    @Autowired
////    private final ProductRepository productRepository;
////    private final CategoryRepository categoryRepository;
////
////
////    @Override
////    public Product saveProduct(Product product) {
////        product.setCreatedAt(LocalDateTime.now());
////        return productRepository.save(product);
////    }
////
////    @Override
////    public Product updateStock(Long productId, boolean inStock) throws ProductException {
////        return null;
////    }
////
////    @Override
////    public Product createProduct(CreateProductRequest req, Seller seller) {
////        Category category1=categoryRepository.findByCategoryId(req.getCategory());
////
////        if (category1==null){
////            Category category=new Category();
////            category.setCategoryId(req.getCategory());
////            category.setLevel(1);
////            category1=categoryRepository.save(category);
////        }
////
////        Category category2=categoryRepository.findByCategoryId(req.getCategory2());
////
////        if (category2==null){
////            Category category=new Category();
////            category.setCategoryId(req.getCategory2());
////            category.setLevel(2);
////            category.setParentCategory(category1);
////            category2=categoryRepository.save(category);
////        }
////        Category category3=categoryRepository.findByCategoryId(req.getCategory3());
////
////        if (category3==null){
////            Category category=new Category();
////            category.setCategoryId(req.getCategory3());
////            category.setLevel(3);
////            category.setParentCategory(category2);
////            category3=categoryRepository.save(category);
////        }
////
////
////        int discountPercentage=calculateDiscountPercentage(req.getMrpPrice(),req.getSellingPrice());
////
//// Product product=new Product();
////        product.setSeller(seller);
////        product.setCategory(category3);
////        product.setDescription(req.getDescription());
////        product.setCreatedAt(LocalDateTime.now());
////        product.setTitle(req.getTitle());
////        product.setColor(req.getColor());
////        product.setSellingPrice(req.getSellingPrice());
////        // Images
////        if (req.getImages() != null) {
////            List<String> cleanImages = req.getImages().stream()
////                    .filter(img -> img != null && !img.isEmpty())
////                    .collect(Collectors.toList());
////            product.setImages(cleanImages);
////        } else {
////            product.setImages(new ArrayList<>());
////        }
////
////
////        product.setQuantity(req.getQuantity());
////        product.setMrpPrice(req.getMrpPrice());
////        product.setSizes(req.getSizes());
////        product.setDiscountPercentage(discountPercentage);
////
////        return productRepository.save(product);
////    }
////
////    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
////        if (mrpPrice<=0 || sellingPrice <=0){
////            throw new IllegalArgumentException("Actual price must be greater than 0");
////        }
////        double discount=mrpPrice-sellingPrice;
////        double discountPercentage=(discount/mrpPrice)*100;
////        return (int)discountPercentage;
////    }
////
////    @Override
////    public void deleteProduct(Long productId) throws ProductException {
////        Product product=findProductById(productId);
////        productRepository.delete(product);
////    }
////
////    @Override
////    public Product updateProduct(Long productId, Product product) throws ProductException {
////        findProductById(productId);
////        product.setId(productId);
////
////        return productRepository.save(product);
////    }
////
////    @Override
////    public Product fidProductById(Long productId) throws ProductException {
////        return productRepository.findById(productId)
////                .orElseThrow(() -> new ProductException("Product not found with id " + productId));
////    }
////
////
////    @Override
////    public Product findProductById(Long productId) throws ProductException {
////        return productRepository.findById(productId).orElseThrow(()->
////                new ProductException("product not found with id "+productId));
////    }
////
////
////
////    @Override
////    public List<Product> searchProducts(String query) {
////        return productRepository.searchProduct(query);
////    }
////
////    @Override
////    public Page<Product> getAllProducts(String category, String brand, String colors, String sizes, String minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber) {
////        Specification<Product> spec=(root, query, criteriaBuilder) -> {
////            List<Predicate> predicates=new ArrayList<>();
////
////            if (category!=null){
////                Join<Product, Category> categoryJoin=root.join("category");
////                predicates.add(criteriaBuilder.equal(categoryJoin.get("categoryId"),category));
////
////            }
////            if (colors !=null && !colors.isEmpty()){
////                //System.out.println("color"+colors);
////                predicates.add(criteriaBuilder.equal(root.get("color"),colors));
////            }
////
////            if (sizes !=null && !sizes.isEmpty()){
////                predicates.add(criteriaBuilder.equal(root.get("size"),sizes));
////            }
////
////            if (minPrice !=null){
////                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"),maxPrice));
////            }
////            if (maxPrice !=null){
////                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"),maxPrice));
////
////            }
////            if (minDiscount !=null){
////                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercentage"),minDiscount));
////            }
////            if (stock !=null){
////                predicates.add(criteriaBuilder.equal(root.get("stock"),stock));
////            }
////            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
////        };
////        Pageable pageable;
////        if (sort!=null && !sort.isEmpty()){
////            pageable = switch (sort) {
////                case "price_low" ->
////                        PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").ascending());
////                case "price_high" ->
////                        PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").descending());
////                default -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10,
////                        Sort.unsorted());
////            };
////
////        }
////        else {
////            pageable=PageRequest.of(pageNumber!=null? pageNumber:0,10,Sort.unsorted());
////
////        }
////        return productRepository.findAll(spec,pageable );
////    }
////
////    @Override
////    public List<Product> getProductBySellerId(Long sellerId) {
////        return productRepository.findBySellerId(sellerId);
////    }
////}
//
//
//
//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.CategoryRepository;
//import com.HS.Repository.ProductRepository;
//import com.HS.Service.Service.CreateProductRequest;
//import com.HS.Service.Service.ProductService;
//import com.HS.exception.ProductException;
//import com.HS.modal.Category;
//import com.HS.modal.Product;
//import com.HS.modal.Seller;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.*;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class ProductServiceImpl implements ProductService {
//
//    private final ProductRepository productRepository;
//    private final CategoryRepository categoryRepository;
//
//    // ✅ CREATE PRODUCT
//    @Override
//    public Product createProduct(CreateProductRequest req, Seller seller) {
//
//        Category level1 = getOrCreateCategory(req.getCategory(), 1, null);
//        Category level2 = getOrCreateCategory(req.getCategory2(), 2, level1);
//        Category level3 = getOrCreateCategory(req.getCategory3(), 3, level2);
//
//        int discount = calculateDiscountPercentage(
//                req.getMrpPrice(), req.getSellingPrice()
//        );
//
//        Product product = new Product();
//        product.setTitle(req.getTitle());
//        product.setDescription(req.getDescription());
//        product.setColor(req.getColor());
//        product.setMrpPrice(req.getMrpPrice());
//        product.setSellingPrice(req.getSellingPrice());
//        product.setQuantity(req.getQuantity());
//        product.setSizes(req.getSizes());
//        product.setDiscountPercentage(discount);
//        product.setSeller(seller);
//        product.setCategory(level3);
//        product.setCreatedAt(LocalDateTime.now());
//
//        product.setImages(
//                req.getImages() == null ? new ArrayList<>() :
//                        req.getImages().stream()
//                                .filter(i -> i != null && !i.isBlank())
//                                .collect(Collectors.toList())
//        );
//
//        // ✅ STOCK LOGIC
//        product.setInStock(req.getQuantity() > 0);
//
//        return productRepository.save(product);
//    }
//
//    // ✅ UPDATE STOCK
//    @Override
//    public Product updateStock(Long productId, boolean inStock) throws ProductException {
//        Product product = findProductById(productId);
//        product.setInStock(inStock);
//        return productRepository.save(product);
//    }
//
//    // ✅ SAVE
//    @Override
//    public Product saveProduct(Product product) {
//        product.setCreatedAt(LocalDateTime.now());
//        return productRepository.save(product);
//    }
//
//    // ✅ UPDATE PRODUCT
//    @Override
//    public Product updateProduct(Long productId, Product product) throws ProductException {
//        findProductById(productId);
//        product.setId(productId);
//        return productRepository.save(product);
//    }
//
//    // ✅ FIND
//    @Override
//    public Product findProductById(Long productId) throws ProductException {
//        return productRepository.findById(productId)
//                .orElseThrow(() ->
//                        new ProductException("Product not found with id " + productId));
//    }
//
//
//    @Override
//    public Product fidProductById(Long productId) throws ProductException {
//        return findProductById(productId);
//    }
//
//    // ✅ DELETE
//    @Override
//    public void deleteProduct(Long productId) throws ProductException {
//        productRepository.delete(findProductById(productId));
//    }
//
//    // ✅ SEARCH
//    @Override
//    public List<Product> searchProducts(String query) {
//        return productRepository.searchProduct(query);
//    }
//
//    // ✅ GET ALL PRODUCTS (NO ERROR)
//    @Override
//    public Page<Product> getAllProducts(
//            String category,
//            String brand,
//            String colors,
//            String sizes,
//            String minPrice,
//            Integer maxPrice,
//            Integer minDiscount,
//            String sort,
//            String stock,
//            Integer pageNumber
//    ) {
//
//        Pageable pageable = PageRequest.of(
//                pageNumber != null ? pageNumber : 0,
//                10,
//                getSort(sort)
//        );
//
//        Page<Product> products = productRepository.findAll(pageable);
//
//        // 🔹 STOCK FILTER
//        if (stock != null) {
//            boolean inStock = stock.equalsIgnoreCase("in_stock");
//            products = new PageImpl<>(
//                    products.stream()
//                            .filter(p -> p.isInStock() == inStock)
//                            .collect(Collectors.toList()),
//                    pageable,
//                    products.getTotalElements()
//            );
//        }
//
//        return products;
//    }
//
//    // ✅ SELLER PRODUCTS
//    @Override
//    public List<Product> getProductBySellerId(Long sellerId) {
//        return productRepository.findBySellerId(sellerId);
//    }
//
//    // 🔧 HELPERS
//    private Category getOrCreateCategory(String id, int level, Category parent) {
//        Category category = categoryRepository.findByCategoryId(id);
//        if (category == null) {
//            category = new Category();
//            category.setCategoryId(id);
//            category.setLevel(level);
//            category.setParentCategory(parent);
//            categoryRepository.save(category);
//        }
//        return category;
//    }
//
//    private int calculateDiscountPercentage(int mrp, int selling) {
//        if (mrp <= 0 || selling <= 0) return 0;
//        return (int) (((mrp - selling) * 100.0) / mrp);
//    }
//
//    private Sort getSort(String sort) {
//        if (sort == null) return Sort.unsorted();
//        return switch (sort) {
//            case "price_low" -> Sort.by("sellingPrice").ascending();
//            case "price_high" -> Sort.by("sellingPrice").descending();
//            default -> Sort.by("createdAt").descending();
//        };
//    }
//}


package com.HS.Service.ServiceImpl;

import com.HS.Repository.CategoryRepository;
import com.HS.Repository.ProductRepository;
import com.HS.Service.Service.CreateProductRequest;
import com.HS.Service.Service.ProductService;
import com.HS.exception.ProductException;
import com.HS.modal.Category;
import com.HS.modal.Product;
import com.HS.modal.Seller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ✅ CREATE PRODUCT
    @Override
    public Product createProduct(CreateProductRequest req, Seller seller) {

        Category level1 = getOrCreateCategory(req.getCategory(), 1, null);
        Category level2 = getOrCreateCategory(req.getCategory2(), 2, level1);
        Category level3 = getOrCreateCategory(req.getCategory3(), 3, level2);

        int discount = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setColor(req.getColor());
        product.setMrpPrice(req.getMrpPrice());
        product.setSellingPrice(req.getSellingPrice());
        product.setQuantity(req.getQuantity());
        product.setSizes(req.getSizes());
        product.setDiscountPercentage(discount);
        product.setSeller(seller);
        product.setCategory(level3);
        product.setCreatedAt(LocalDateTime.now());

        product.setImages(
                req.getImages() == null ? new ArrayList<>() :
                        req.getImages().stream()
                                .filter(i -> i != null && !i.isBlank())
                                .collect(Collectors.toList())
        );

        product.setInStock(req.getQuantity() > 0);

        return productRepository.save(product);
    }

    // ✅ UPDATE STOCK
    @Override
    public Product updateStock(Long productId, boolean inStock) throws ProductException {
        Product product = findProductById(productId);
        product.setInStock(inStock);
        return productRepository.save(product);
    }

    // ✅ SAVE
    @Override
    public Product saveProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    // ✅ UPDATE
    @Override
    public Product updateProduct(Long productId, Product product) throws ProductException {
        findProductById(productId);
        product.setId(productId);
        return productRepository.save(product);
    }

    // ✅ FIND
    @Override
    public Product findProductById(Long productId) throws ProductException {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found with id " + productId));
    }

    @Override
    public Product fidProductById(Long productId) throws ProductException {
        return findProductById(productId);
    }

    // ✅ DELETE
    @Override
    public void deleteProduct(Long productId) throws ProductException {
        productRepository.delete(findProductById(productId));
    }

    // ✅ SEARCH
    @Override
    public List<Product> searchProducts(String query) {
        return productRepository.searchProduct(query);
    }

    // ✅ 🔥 MAIN FIXED FILTER METHOD
    @Override
    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            String minPrice,
            Integer maxPrice,
            Integer mindiscount,
            String sort,
            String stock,
            Integer pageNumber
    ) {

        Pageable pageable = PageRequest.of(
                pageNumber != null ? pageNumber : 0,
                10,
                getSort(sort)
        );

        Page<Product> products = productRepository.findAll(pageable);

        List<Product> filtered = products.getContent();

        // ✅ CATEGORY FILTER
        if (category != null && !category.isEmpty()) {
            filtered = filtered.stream()
                    .filter(p -> p.getCategory() != null &&
                            category.equals(p.getCategory().getCategoryId()))
                    .collect(Collectors.toList());
        }

        // ✅ COLOR FILTER
        if (colors != null && !colors.isEmpty()) {
            filtered = filtered.stream()
                    .filter(p -> colors.equalsIgnoreCase(p.getColor()))
                    .collect(Collectors.toList());
        }

        // ✅ SIZE FILTER
        if (sizes != null && !sizes.isEmpty()) {
            filtered = filtered.stream()
                    .filter(p -> p.getSizes() != null &&
                            p.getSizes().toLowerCase().contains(sizes.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // ✅ PRICE FILTER (FIXED)
        if (minPrice != null) {
            int min = Integer.parseInt(minPrice);
            filtered = filtered.stream()
                    .filter(p -> p.getSellingPrice() >= min)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            filtered = filtered.stream()
                    .filter(p -> p.getSellingPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        // ✅ DISCOUNT FILTER
        if (mindiscount != null) {
            filtered = filtered.stream()
                    .filter(p -> p.getDiscountPercentage() >= mindiscount)
                    .collect(Collectors.toList());
        }

        // ✅ STOCK FILTER
        if (stock != null) {
            boolean inStock = stock.equalsIgnoreCase("in_stock");
            filtered = filtered.stream()
                    .filter(p -> p.isInStock() == inStock)
                    .collect(Collectors.toList());
        }

        return new PageImpl<>(filtered, pageable, filtered.size());
    }

    // ✅ SELLER PRODUCTS
    @Override
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    // 🔧 HELPERS
    private Category getOrCreateCategory(String id, int level, Category parent) {
        Category category = categoryRepository.findByCategoryId(id);
        if (category == null) {
            category = new Category();
            category.setCategoryId(id);
            category.setLevel(level);
            category.setParentCategory(parent);
            categoryRepository.save(category);
        }
        return category;
    }

    private int calculateDiscountPercentage(int mrp, int selling) {
        if (mrp <= 0 || selling <= 0) return 0;
        return (int) (((mrp - selling) * 100.0) / mrp);
    }

    private Sort getSort(String sort) {
        if (sort == null) return Sort.unsorted();

        return switch (sort) {
            case "price_low" -> Sort.by("sellingPrice").ascending();
            case "price_high" -> Sort.by("sellingPrice").descending();
            default -> Sort.by("createdAt").descending();
        };
    }
}