package com.HS.request;

import com.HS.domine.USER_ROLE;
import lombok.Data;

@Data
public class LoginOtpRequest {

    private String email;
   private String otp;
    private USER_ROLE role;
}
