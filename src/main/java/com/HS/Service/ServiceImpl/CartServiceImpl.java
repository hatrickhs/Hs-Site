
package com.HS.Service.ServiceImpl;

import com.HS.Repository.CartItemRepository;
import com.HS.Repository.CartRepository;
import com.HS.Repository.CouponRepository;
import com.HS.Service.Service.CartService;
import com.HS.modal.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem addCartItem(
            User user,
            Product product,
            Deal deal,
            String size,
            int quantity
    ) {

        Cart cart = findUserCart(user);

        CartItem existingItem = null;

        // PRODUCT CASE
        if (product != null) {

            existingItem =
                    cartItemRepository.findByCartAndProductAndSize(
                            cart,
                            product,
                            size
                    );
        }

        // =========================
        // CASE 1 : NEW ITEM
        // =========================
        if (existingItem == null) {

            CartItem cartItem = new CartItem();

            cartItem.setProduct(product);
            cartItem.setDeal(deal);

            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setSize(size);
            cartItem.setCart(cart);

            // =========================
            // PRICE CALCULATION
            // =========================

            int mrpTotal = 0;
            int sellingTotal = 0;

            // PRODUCT PRICE
            if (product != null) {

                mrpTotal = quantity * product.getMrpPrice();

                sellingTotal =
                        quantity * product.getSellingPrice();
            }

            // DEAL PRICE
            else if (deal != null) {

                mrpTotal = quantity * deal.getMrpPrice();

                sellingTotal =
                        quantity * deal.getSellingPrice();
            }

            cartItem.setMrpPrice(mrpTotal);
            cartItem.setSellingPrice(sellingTotal);

            cart.getCartItems().add(cartItem);

            return cartItemRepository.save(cartItem);
        }

        // =========================
        // CASE 2 : ITEM EXISTS
        // =========================
        else {

            existingItem.setQuantity(
                    existingItem.getQuantity() + quantity
            );

            int mrpTotal = 0;
            int sellingTotal = 0;

            // PRODUCT PRICE
            if (product != null) {

                mrpTotal =
                        existingItem.getQuantity()
                                * product.getMrpPrice();

                sellingTotal =
                        existingItem.getQuantity()
                                * product.getSellingPrice();
            }

            // DEAL PRICE
            else if (deal != null) {

                mrpTotal =
                        existingItem.getQuantity()
                                * deal.getMrpPrice();

                sellingTotal =
                        existingItem.getQuantity()
                                * deal.getSellingPrice();
            }

            existingItem.setMrpPrice(mrpTotal);
            existingItem.setSellingPrice(sellingTotal);

            return cartItemRepository.save(existingItem);
        }
    }

    @Override
    public Cart findUserCart(User user) {

        Cart cart = cartRepository.findByUserId(user.getId());

        int totalMrp = 0;
        int totalSelling = 0;
        int totalItems = 0;

        for (CartItem item : cart.getCartItems()) {

            totalMrp += item.getMrpPrice();
            totalSelling += item.getSellingPrice();
            totalItems += item.getQuantity();
        }

        cart.setTotalMrpPrice(totalMrp);
        cart.setTotalSellingPrice(totalSelling);
        cart.setTotalItem(totalItems);

        cart.setDiscount(
                calculateDiscountPercentage(
                        totalMrp,
                        totalSelling
                )
        );

        return cart;
    }

    private int calculateDiscountPercentage(
            int mrpPrice,
            int sellingPrice
    ) {

        if (mrpPrice <= 0) {
            return 0;
        }

        double discount = mrpPrice - sellingPrice;

        double percent =
                (discount / mrpPrice) * 100;

        return (int) percent;
    }

}