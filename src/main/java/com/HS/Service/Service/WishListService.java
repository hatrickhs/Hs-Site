package com.HS.Service.Service;

import com.HS.modal.Deal;
import com.HS.modal.Product;
import com.HS.modal.User;
import com.HS.modal.WishList;

public interface WishListService {
    WishList createWishlist(User user);
    WishList getWishListByUserId(User user);
    WishList addProductToWishList(User user, Product product);

    WishList addDealToWishList(User user, Deal deal);


    WishList removeProductFromWishList(User user, Product product);

    WishList removeDealFromWishList(User user, Deal deal);
}
