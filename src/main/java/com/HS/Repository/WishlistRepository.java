package com.HS.Repository;

import com.HS.modal.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<WishList, Long> {

    WishList findByUserId(Long userId);

}
