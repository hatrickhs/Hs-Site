package com.HS.Repository;

import com.HS.modal.Cart;
import com.HS.modal.CartItem;
import com.HS.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem , Long> {

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
