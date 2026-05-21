//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.CartItemRepository;
//import com.HS.Service.Service.CartItemService;
//import com.HS.modal.CartItem;
//import com.HS.modal.User;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class CartItemServiceImpl implements CartItemService {
//
//    private final CartItemRepository cartItemRepository;
//
//    @Override
//    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
//        CartItem item=findCartItemById(id);
//
//        User cartItemIUser=item.getCart().getUser();
//
//        if (cartItemIUser.getId().equals(userId)){
//            item.setQuantity(cartItem.getQuantity());
//            item.setMrpPrice(item.getQuantity()*item.getProduct().getMrpPrice());
//            item.setSellingPrice(item.getQuantity()*item.getProduct().getSellingPrice());
//            return cartItemRepository.save(item);
//        }
//       throw new Exception("you can update this cartItem");
//    }
//
//    @Override
//    public void removeCartItem(Long userId, Long cartItemId) throws Exception {
//        CartItem item=findCartItemById(cartItemId);
//
//        User cartItemIUser=item.getCart().getUser();
//
//        if (cartItemIUser.getId().equals(userId)){
//            cartItemRepository.delete(item);
//        }
//        else throw new Exception("you an't delete this item");
//
//    }
//
//    @Override
//    public CartItem findCartItemById(Long id) throws Exception {
//        return cartItemRepository.findById(id).orElseThrow(()->
//                new Exception("cart item not found with id"+id));
//    }
//}

package com.HS.Service.ServiceImpl;

import com.HS.Repository.CartItemRepository;
import com.HS.Service.Service.CartItemService;
import com.HS.modal.CartItem;
import com.HS.modal.Deal;
import com.HS.modal.Product;
import com.HS.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem updateCartItem(
            Long userId,
            Long id,
            CartItem cartItem
    ) throws Exception {

        CartItem item = findCartItemById(id);

        User cartItemUser = item.getCart().getUser();

        if (cartItemUser.getId().equals(userId)) {

            item.setQuantity(cartItem.getQuantity());

            // =========================
            // PRODUCT CASE
            // =========================
            if (item.getProduct() != null) {

                Product product = item.getProduct();

                item.setMrpPrice(
                        item.getQuantity() * product.getMrpPrice()
                );

                item.setSellingPrice(
                        item.getQuantity() * product.getSellingPrice()
                );
            }

            // =========================
            // DEAL CASE
            // =========================
            else if (item.getDeal() != null) {

                Deal deal = item.getDeal();

                item.setMrpPrice(
                        item.getQuantity() * deal.getMrpPrice()
                );

                item.setSellingPrice(
                        item.getQuantity() * deal.getSellingPrice()
                );
            }

            return cartItemRepository.save(item);
        }

        throw new Exception("you can update this cartItem");
    }

    @Override
    public void removeCartItem(
            Long userId,
            Long cartItemId
    ) throws Exception {

        CartItem item = findCartItemById(cartItemId);

        User cartItemUser = item.getCart().getUser();

        if (cartItemUser.getId().equals(userId)) {

            cartItemRepository.delete(item);

        } else {

            throw new Exception("you can't delete this item");
        }
    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {

        return cartItemRepository.findById(id)
                .orElseThrow(() ->
                        new Exception("cart item not found with id " + id));
    }
}