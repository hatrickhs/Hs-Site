package com.HS.response;

import com.HS.domine.USER_ROLE;
import com.HS.modal.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private USER_ROLE role;
    private User user;

}
