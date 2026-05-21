package com.HS.response;

import com.HS.domine.USER_ROLE;
import com.HS.modal.Seller;
import lombok.Data;

@Data
public class SellerAuthResponse {
    private String jwt;
    private String message;
    private USER_ROLE role;
    private Seller seller;
}
