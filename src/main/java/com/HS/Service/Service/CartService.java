package com.HS.Service.Service;

import com.HS.modal.*;

public interface CartService {

    public CartItem addCartItem(
            User user,
            Product product,
            Deal deal,
            String size,
            int quantity
    );
    public Cart findUserCart(User user);

}
