package com.HS.Controller;

import com.HS.Service.Service.DealService;
import com.HS.Service.Service.ProductService;
import com.HS.Service.Service.UserService;
import com.HS.Service.Service.WishListService;
import com.HS.modal.Deal;
import com.HS.modal.Product;
import com.HS.modal.User;
import com.HS.modal.WishList;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishListController {

    private final WishListService wishListService;
    private final UserService userService;
    private final ProductService productService;
    private final DealService dealService;

    @GetMapping()
    public ResponseEntity<WishList> getWishListByUserId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        WishList wishList = wishListService.getWishListByUserId(user);
        return ResponseEntity.ok(wishList);
    }
@PostMapping("/add-product/{productId}")
    public  ResponseEntity<WishList> addProductToWishList(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {

    Product product = productService.findProductById(productId);
    User user = userService.findUserByJwtToken(jwt);
    WishList updateWishList = wishListService.addProductToWishList(
            user,
            product
    );
    return ResponseEntity.ok(updateWishList);
}

    @PostMapping("/add-deal/{dealId}")
    public ResponseEntity<WishList> addDealToWishList(
            @PathVariable Long dealId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        // assume you have DealService
        Deal deal = dealService.findById(dealId);

        WishList updated = wishListService.addDealToWishList(user, deal);

        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/remove-product/{productId}")
    public ResponseEntity<WishList> removeProductFromWishList(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Product product = productService.findProductById(productId);

        WishList updated = wishListService.removeProductFromWishList(user, product);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/remove-deal/{dealId}")
    public ResponseEntity<WishList> removeDealFromWishList(
            @PathVariable Long dealId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Deal deal = dealService.findById(dealId);

        WishList updated = wishListService.removeDealFromWishList(user, deal);

        return ResponseEntity.ok(updated);
    }
 }
