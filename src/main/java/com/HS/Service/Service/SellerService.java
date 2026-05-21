package com.HS.Service.Service;

import com.HS.domine.AccountStatus;
import com.HS.exception.SellerException;
import com.HS.modal.Seller;

import java.util.List;

public interface SellerService {
    Seller getSellerProfile(String jwt);

    Seller createseller(Seller seller);

    Seller getSellerById(Long id) throws SellerException;

    Seller getSellerByEmail(String email);

    List<Seller> getAllSeller(AccountStatus status);

    Seller updateSeller(Long id, Seller seller) throws SellerException;

    void deleteSeller(Long id) throws SellerException;

    Seller verifyEmail(String email, String otp);

    Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws SellerException;
}


