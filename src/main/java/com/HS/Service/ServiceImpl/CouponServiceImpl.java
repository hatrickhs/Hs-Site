package com.HS.Service.ServiceImpl;

import com.HS.Repository.CartRepository;
import com.HS.Repository.CouponRepository;
import com.HS.Repository.UserRepository;
import com.HS.Service.Service.CouponService;
import com.HS.modal.Cart;
import com.HS.modal.Coupon;
import com.HS.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

//    @Override
//    public Cart applyCoupon(String code, double orderValue, User user) throws Exception {
//        Coupon coupon=couponRepository.findByCode(code);
//
//        Cart cart=cartRepository.findByUserId(user.getId());
//
//        if (coupon==null){
//            throw new Exception(("coupon not valid"));
//        }
//        if (user.getUsedCoupons().contains(coupon)){
//            throw new Exception("coupon already used");
//        }
//        if (orderValue<=coupon.getMinimumOrderValue()){
//            throw new Exception(" valid for minimum order value"+coupon.getMinimumOrderValue());
//        }
//
//        if (coupon.isActive()&& LocalDate.now().isAfter(coupon.getValidityStartDate())
//            && LocalDate.now().isBefore(coupon.getValidityEndDate())
//                ){
//            user.getUsedCoupons().add(coupon);
//            userRepository.save(user);
//
//            double discountedPrice =( cart.getTotalSellingPrice()*coupon.getDiscountPercentage()/100);
//
//            cart.setTotalSellingPrice(cart.getTotalSellingPrice()-discountedPrice);
//            cart.setCouponCode(code);
//            cartRepository.save(cart);
//            return  cart;
//        }
//       throw  new Exception("coupon not valid");
//    }

    @Override
    public Cart applyCoupon(String code, double orderValue, User user) throws Exception {

        Coupon coupon = couponRepository.findByCode(code);

        if (coupon == null) {
            throw new Exception("coupon not found");
        }

        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart == null) {
            throw new Exception("cart not found");
        }

        // already used check
        if (user.getUsedCoupons().contains(coupon)) {
            throw new Exception("coupon already used");
        }

        // minimum order value check
        if (orderValue < coupon.getMinimumOrderValue()) {
            throw new Exception(
                    "Coupon valid only for minimum order value "
                            + coupon.getMinimumOrderValue()
            );
        }

        LocalDate today = LocalDate.now();

        // active check
        if (!coupon.isActive()) {
            throw new Exception("coupon inactive");
        }

        // start date check
        if (coupon.getValidityStartDate() != null &&
                today.isBefore(coupon.getValidityStartDate())) {

            throw new Exception("coupon not started yet");
        }

        // end date check
        if (coupon.getValidityEndDate() != null &&
                today.isAfter(coupon.getValidityEndDate())) {

            throw new Exception("coupon expired");
        }

        // ORIGINAL PRICE
        double originalPrice = cart.getTotalPrice();

        // discount amount
        double discountAmount =
                (originalPrice * coupon.getDiscountPercentage()) / 100;

        // final price
        double finalPrice = originalPrice - discountAmount;

        // prevent negative
        if (finalPrice < 0) {
            finalPrice = 0;
        }

        cart.setCouponDiscount(discountAmount);
        cart.setTotalSellingPrice(finalPrice);
        cart.setCouponCode(code);

        user.getUsedCoupons().add(coupon);

        userRepository.save(user);

        return cartRepository.save(cart);
    }

//    @Override
//    public Cart removeCoupon(String code, User user) throws Exception {
//        Coupon coupon = couponRepository.findByCode(code);
//
//        if (coupon==null){
//            throw  new Exception("coupon not found");
//        }
//        Cart cart=cartRepository.findByUserId(user.getId());
//        double discountedPrice =( cart.getTotalSellingPrice()*coupon.getDiscountPercentage()/100);
//
//        cart.setTotalSellingPrice(cart.getTotalSellingPrice()+discountedPrice);
//        cart.setCouponCode(null);
//
//        return cartRepository.save(cart);
//    }

    @Override
    public Cart removeCoupon(String code, User user) throws Exception {

        Coupon coupon = couponRepository.findByCode(code);

        if (coupon == null) {
            throw new Exception("coupon not found");
        }

        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart == null) {
            throw new Exception("cart not found");
        }

        // ❌ remove coupon discount completely
        cart.setCouponDiscount(0);

        // remove coupon code
        cart.setCouponCode(null);

        // OPTIONAL: recalculate total price (important)
        double originalPrice = cart.getCartItems().stream()
                .mapToDouble(item -> item.getSellingPrice() * item.getQuantity())
                .sum();

        cart.setTotalSellingPrice(originalPrice);

        return cartRepository.save(cart);
    }

    @Override
    public Coupon findCouponById(Long id) throws Exception {
        return couponRepository.findById(id).orElseThrow(()->
                new Exception("coupon not found"));
    }

    @Override
    @PreAuthorize("hasRole ('ADMIN')")
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupon> findAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    @PreAuthorize("hasRole ('ADMIN')")
    public void deleteCoupon(Long id) throws Exception {
        findCouponById(id);
        couponRepository.deleteById(id);

    }
}
