package com.HS.Service.ServiceImpl;

import com.HS.Repository.WishlistRepository;
import com.HS.Service.Service.WishListService;
import com.HS.modal.Deal;
import com.HS.modal.Product;
import com.HS.modal.User;
import com.HS.modal.WishList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishListServiceImpl implements WishListService {

    private final WishlistRepository wishlistRepository;

    @Override
    public WishList createWishlist(User user) {
        WishList wishList = new WishList();
        wishList.setUser(user);
        return wishlistRepository.save(wishList);
    }

    @Override
    public WishList getWishListByUserId(User user) {
        WishList wishList = wishlistRepository.findByUserId(user.getId());
        if (wishList == null) {
            wishList = createWishlist(user);
        }
        return wishList;
    }

    @Override
    public WishList addProductToWishList(User user, Product product) {
        WishList wishList = getWishListByUserId(user);

        if (wishList.getProducts().contains(product)) {
            wishList.getProducts().remove(product);
        } else {
            wishList.getProducts().add(product);
        }

        return wishlistRepository.save(wishList);
    }

    @Override
    public WishList addDealToWishList(User user, Deal deal) {

        WishList wishList = getWishListByUserId(user);

        if (!wishList.getDeals().contains(deal)) {
            wishList.getDeals().add(deal);
        }

        return wishlistRepository.save(wishList);
    }

    @Override
    public WishList removeProductFromWishList(User user, Product product) {

        WishList wishList = getWishListByUserId(user);

        if (wishList.getProducts() != null &&
                wishList.getProducts().contains(product)) {

            wishList.getProducts().remove(product);
        }

        return wishlistRepository.save(wishList);
    }

    @Override
    public WishList removeDealFromWishList(User user, Deal deal) {

        WishList wishList = getWishListByUserId(user);

        if (wishList.getDeals() != null) {
            wishList.getDeals().removeIf(d -> d.getId().equals(deal.getId()));
        }

        return wishlistRepository.save(wishList);
    }
}
