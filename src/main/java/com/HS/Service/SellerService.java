package com.HS.Service;

import com.HS.domine.AccountStatus;
import com.HS.exception.SellerException;
import com.HS.modal.Seller;

import java.util.List;

public interface SellerService {

    Seller getSellerProfile(String jwt) throws Exception;
    Seller createseller(Seller seller) throws Exception;
    Seller getSellerById(Long id) throws SellerException;
    Seller getSellerByEmail(String email) throws Exception;
    List<Seller> getAllSeller(AccountStatus status);
    Seller updateSeller(Long id,Seller seller) throws Exception;
    void deleteSeller(Long id) throws SellerException;
    Seller verifyEmail(String email,String otp);
    Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws SellerException;

}
