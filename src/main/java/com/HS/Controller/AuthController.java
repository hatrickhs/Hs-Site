package com.HS.Controller;

import com.HS.Repository.UserRepository;
import com.HS.Service.Service.AuthService;
import com.HS.domine.USER_ROLE;
import com.HS.modal.VerificationCode;
import com.HS.request.LoginOtpRequest;
import com.HS.request.LoginRequest;
import com.HS.response.ApiResponse;
import com.HS.response.AuthResponse;
import com.HS.response.SignupRequest;
import com.HS.modal.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest request) throws Exception {
        String jwt = authService.createUser(request);

        AuthResponse response = new AuthResponse();
        response.setJwt(jwt);
        response.setMessage("registered Success");

        // Signup always as customer
        response.setRole(USER_ROLE.ROLE_CUSTOMER);

        return ResponseEntity.ok(response);
    }


    @PostMapping ("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sentOtpHandler(
            @RequestBody LoginOtpRequest request) throws Exception {

        authService.sentLoginOtp(request.getEmail(),request.getRole());

        ApiResponse response=new ApiResponse();

        response.setMessage("otp sent Successfully");



        return ResponseEntity.ok(response);
    }

    @PostMapping ("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) throws Exception {

       AuthResponse authResponse= authService.signing(request);

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> passwordLogin(@RequestBody LoginRequest request) throws Exception {

        AuthResponse authResponse = authService.loginWithPassword(request);

        return ResponseEntity.ok(authResponse);
    }

}
