package com.HS.Controller;

import com.HS.Repository.CartRepository;
import com.HS.Repository.UserRepository;
import com.HS.Service.Service.*;
import com.HS.exception.ProductException;
import com.HS.modal.*;
import com.HS.request.AddItemRequest;
import com.HS.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.security.Principal;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;
    private final DealService dealService;
    private final CouponService couponService;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;


    @GetMapping
    public ResponseEntity<Cart> findUserHandler(
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Cart cart = cartService.findUserCart(user);
        System.out.println("cart - " + cart.getUser().getEmail());

        return new ResponseEntity<Cart>(cart, HttpStatus.OK);
    }

//    @PutMapping("/add")
//
//    public ResponseEntity<CartItem> addItemToCart(
//            @RequestBody AddItemRequest req,
//
//            @RequestHeader("Authorization") String jwt)
//            throws ProductException, Exception {
//
//        User user = userService.findUserByJwtToken(jwt);
//        Product product = productService.findProductById(req.getProductId());
//
//        CartItem item= cartService.addCartItem(user,product, deal,req.getSize(),req.getQuantity());
//
//        ApiResponse res= new ApiResponse();
//        res.setMessage("Item Added To Cart Successfully");
//
//        return new ResponseEntity<>(item,HttpStatus.ACCEPTED);
//
//    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(
            @RequestBody AddItemRequest req,
            @RequestHeader("Authorization") String jwt)
            throws ProductException, Exception {

        User user = userService.findUserByJwtToken(jwt);

        Product product = null;
        Deal deal = null;

        // PRODUCT ADD
        if (req.getProductId() != null) {
            product = productService.findProductById(req.getProductId());
        }

        // DEAL ADD
        if (req.getDealId() != null) {
            deal = dealService.findById(req.getDealId());


        }

        CartItem item = cartService.addCartItem(
                user,
                product,
                deal,
                req.getSize(),
                req.getQuantity()
        );

        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse>deleteCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization")String jwt)
        throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        cartItemService.removeCartItem(user.getId(), cartItemId);

        ApiResponse res=new ApiResponse();
        res.setMessage("Item Remove From Cart");

        return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem>updateCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestBody CartItem cartItem,
            @RequestHeader("Authorization")String jwt)
        throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        CartItem updateCartItem = null;
        if (cartItem.getQuantity() > 0) {
            updateCartItem = cartItemService.updateCartItem(user.getId(),
                    cartItemId, cartItem);
        }

         return new ResponseEntity<>(updateCartItem,HttpStatus.ACCEPTED);
    }

//    @PostMapping("/apply-coupon")
//    public ResponseEntity<Cart> applyCoupon(
//            @RequestParam String code,
//            @RequestParam double orderValue,
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//
//        User user = userService.findUserByJwtToken(jwt);
//
//        Cart cart = couponService.applyCoupon(code, orderValue, user);
//
//        return new ResponseEntity<>(cart, HttpStatus.OK);
//    }

    @PostMapping("/apply-coupon")
    public ResponseEntity<Cart> applyCoupon(
            @RequestBody Map<String, Object> req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        String code = (String) req.get("couponCode");

        User user = userService.findUserByJwtToken(jwt);

        Cart cart = cartRepository.findByUserId(user.getId());

        double orderValue = cart.getTotalSellingPrice(); // auto fix

        Cart updatedCart = couponService.applyCoupon(code, orderValue, user);

        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove-coupon")
    public ResponseEntity<Cart> removeCoupon(
            @RequestParam String code,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Cart cart = couponService.removeCoupon(code, user);

        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PutMapping("/remove-coupon")
    public ResponseEntity<Cart> removeCoupon(
            @RequestBody Map<String, String> request,
            Principal principal
    ) throws Exception {

        String email = principal.getName(); // JWT subject

        User user = userRepository.findByEmail(email);

        String couponCode = request.get("couponCode");

        return ResponseEntity.ok(
                couponService.removeCoupon(couponCode, user)
        );
    }
}