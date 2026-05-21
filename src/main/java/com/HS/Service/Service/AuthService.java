package com.HS.Service.Service;
import com.HS.domine.USER_ROLE;
import com.HS.request.LoginRequest;
import com.HS.response.AuthResponse;
import com.HS.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp (String email, USER_ROLE role) throws Exception;
    String createUser(SignupRequest request) throws Exception;
AuthResponse signing(LoginRequest request) throws Exception;

    AuthResponse loginWithPassword(LoginRequest request) throws Exception;
}
