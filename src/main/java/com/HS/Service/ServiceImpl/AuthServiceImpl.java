//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.CartRepository;
//import com.HS.Repository.SellerRepository;
//import com.HS.Repository.UserRepository;
//import com.HS.Repository.VerificationCodeRepository;
//import com.HS.Security.JwtProvider;
//import com.HS.Service.EmailService;
//import com.HS.Service.Service.AuthService;
//import com.HS.Util.OtpUtil;
//import com.HS.domine.USER_ROLE;
//import com.HS.modal.Cart;
//import com.HS.modal.Seller;
//import com.HS.modal.User;
//import com.HS.modal.VerificationCode;
//import com.HS.request.LoginRequest;
//import com.HS.response.AuthResponse;
//import com.HS.response.SignupRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import javax.swing.text.BadLocationException;
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class AuthServiceImpl implements AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final CartRepository cartRepository;
//    private final JwtProvider jwtProvider;
//    private final VerificationCodeRepository verificationCodeRepository;
//    private final EmailService emailService;
//    private final CustomUserServiceImpl customUserService;
//    private final SellerRepository sellerRepository;
//    private final AuthenticationManager authenticationManager;
//
//
//    @Override
//    public void sentLoginOtp(String email,USER_ROLE role) throws Exception {
//
//
//        String SIGNING_PREFIX = "signing_";
//
//        if (email.startsWith(SIGNING_PREFIX)){
//            email=email.substring(SIGNING_PREFIX.length());
//
//            if (role.equals(USER_ROLE.ROLE_SELLER)){
//                Seller seller=sellerRepository.findByEmail(email);
//                if (seller==null){
//                    throw  new Exception("seller not found");
//                }
//
//            }
//else {
//                User user=userRepository.findByEmail(email);
//                if (user==null){
//                    throw new Exception("user not exist with provided email");
//                }
//            }
//
//        }
//
//        VerificationCode isExist=verificationCodeRepository.findByEmail(email);
//        if (isExist!=null){
//            verificationCodeRepository.delete(isExist);
//        }
//
//        String otp = OtpUtil.generateOtp();
//
//        VerificationCode verificationCode=new VerificationCode();
//        verificationCode.setOtp(otp);
//        verificationCode.setEmail(email);
//        verificationCodeRepository.save(verificationCode);
//
//        String subject="Hs bazaar logi/signup otp";
//        String text="your login/signup otp is" + otp;
//
//        emailService.sendVerificationOtpEmail(email,otp,subject,text);
//
//
//    }
//
//    @Override
//    public String createUser(SignupRequest request) throws Exception {
//
//        VerificationCode verificationCode=verificationCodeRepository.findByEmail(request.getEmail());
//
//        if (verificationCode==null || !verificationCode.getOtp().equals(request.getOtp()) ){
//            throw new Exception("wrong otp...");
//        }
//
//        User user = userRepository.findByEmail(request.getEmail());
//
//        if(user ==null){
//            User createdUser=new User();
//            createdUser.setEmail(request.getEmail());
//            createdUser.setFullName(request.getFullName());
//            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
//            createdUser.setMobile("1234567890");
//            createdUser.setPassword(passwordEncoder.encode(request.getOtp()));
//
//            user= userRepository.save(createdUser);
//
//            Cart cart=new Cart();
//            cart.setUser(user);
//            cartRepository.save(cart);
//
//        }
//        List<GrantedAuthority> authorities= new ArrayList<>();
//        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));
//
//        Authentication authentication=new UsernamePasswordAuthenticationToken(request.getEmail(),null, authorities);
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//
//        return jwtProvider.generateToken(authentication);
//    }
//
//    public AuthResponse loginWithPassword(LoginRequest loginRequest) throws Exception {
//
//        Authentication authentication =
//                authenticationManager.authenticate(
//                        new UsernamePasswordAuthenticationToken(
//                                loginRequest.getEmail(),
//                                loginRequest.getPassword()
//                        )
//                );
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        String token = jwtProvider.generateToken(authentication);
//
//        AuthResponse response = new AuthResponse();
//        response.setJwt(token);
//        response.setMessage("Login Success");
//
//        // Role set செய்ய
//        String role = authentication.getAuthorities()
//                .iterator()
//                .next()
//                .getAuthority();
//
//        response.setRole(USER_ROLE.valueOf(role));
//
//        return response;
//    }
//
//
//    @Override
//    public AuthResponse signing(LoginRequest request) throws Exception {
//        String username=request.getEmail();
//        String otp=request.getOtp();
//
//        Authentication authentication=authenticate(username,otp);
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        String token=jwtProvider.generateToken(authentication);
//
//        AuthResponse authResponse=new AuthResponse();
//        authResponse.setJwt(token);
//        authResponse.setMessage("Login Success");
//
//
//        Collection<? extends GrantedAuthority> authorities=authentication.getAuthorities();
//        String roleName=authorities.isEmpty()?null:authorities.iterator().next().getAuthority();
//
//
//        authResponse.setRole(USER_ROLE.valueOf(roleName));
//        return authResponse;
//
//
//    }
//
//    private Authentication authenticate(String username, String otp) throws Exception {
//
//        String SELLER_PREFIX="seller_";
//        if(username.startsWith(SELLER_PREFIX)){
//           username = username.substring(SELLER_PREFIX.length());
//        }
//        UserDetails userDetails =customUserService.loadUserByUsername(username);
//
//        if (userDetails==null){
//            throw new BadCredentialsException("invalid username ");
//
//        }
//
//        VerificationCode verificationCode=verificationCodeRepository.findByEmail(username);
//
//        System.out.println("Authenticating username: " + username + ", OTP provided: " + otp);
//        System.out.println("Stored OTP: " + (verificationCode != null ? verificationCode.getOtp() : "null"));
//
//        if (verificationCode==null || !verificationCode.getOtp().equals(otp)){
//            throw new Exception("wrong otp");
//        }
//        return new UsernamePasswordAuthenticationToken(
//                username, null, userDetails.getAuthorities()
//        );
//
//    }
//}

package com.HS.Service.ServiceImpl;

import com.HS.Repository.*;
import com.HS.Security.JwtProvider;
import com.HS.Service.EmailService;
import com.HS.Service.Service.AuthService;
import com.HS.Util.OtpUtil;
import com.HS.domine.USER_ROLE;
import com.HS.modal.*;
import com.HS.request.LoginRequest;
import com.HS.response.AuthResponse;
import com.HS.response.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserService;
    private final SellerRepository sellerRepository;
    private final AuthenticationManager authenticationManager;

    @Override
    public void sentLoginOtp(String email, USER_ROLE role) throws Exception {

        String SIGNING_PREFIX = "signing_";

        if (email.startsWith(SIGNING_PREFIX)) {
            email = email.substring(SIGNING_PREFIX.length());

            if (role.equals(USER_ROLE.ROLE_SELLER)) {
                Seller seller = sellerRepository.findByEmail(email);
                if (seller == null) {
                    throw new Exception("seller not found");
                }
            } else {
                User user = userRepository.findByEmail(email);
                if (user == null) {
                    throw new Exception("user not exist with provided email");
                }
            }
        }

        // ❌ OLD OTP REMOVE
        VerificationCode oldOtp =
                verificationCodeRepository.findTopByEmailOrderByIdDesc(email);

        if (oldOtp != null) {
            verificationCodeRepository.delete(oldOtp);
        }

        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(email);
        verificationCodeRepository.save(verificationCode);

        String subject = "Hs bazaar login/signup otp";
        String text = "your login/signup otp is " + otp;

        emailService.sendVerificationOtpEmail(email, otp, subject, text);
    }

    @Override
    public String createUser(SignupRequest request) throws Exception {

        VerificationCode verificationCode =
                verificationCodeRepository.findTopByEmailOrderByIdDesc(request.getEmail());

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(request.getOtp())) {
            throw new Exception("wrong otp...");
        }

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            User createdUser = new User();
            createdUser.setEmail(request.getEmail());
            createdUser.setFullName(request.getFullName());
            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setMobile("1234567890");
            createdUser.setPassword(passwordEncoder.encode(request.getOtp()));

            user = userRepository.save(createdUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                USER_ROLE.ROLE_CUSTOMER.toString()
        ));

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        null,
                        authorities
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signing(LoginRequest request) throws Exception {

        Authentication authentication =
                authenticate(request.getEmail(), request.getOtp());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login Success");

        Collection<? extends GrantedAuthority> authorities =
                authentication.getAuthorities();

        String roleName = authorities.isEmpty()
                ? null
                : authorities.iterator().next().getAuthority();

        authResponse.setRole(USER_ROLE.valueOf(roleName));

        return authResponse;
    }

    private Authentication authenticate(String username, String otp) throws Exception {

        if (username.startsWith("seller_")) {
            username = username.substring("seller_".length());
        }

        UserDetails userDetails =
                customUserService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("invalid username");
        }

        // 🔥 IMPORTANT FIX HERE
        VerificationCode verificationCode =
                verificationCodeRepository.findTopByEmailOrderByIdDesc(username);

        System.out.println("USERNAME: " + username);
        System.out.println("OTP USER: " + otp);
        System.out.println("OTP DB: " +
                (verificationCode != null ? verificationCode.getOtp() : "null"));

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(otp)) {
            throw new Exception("wrong otp");
        }

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                userDetails.getAuthorities()
        );
    }

    @Override
    public AuthResponse loginWithPassword(LoginRequest loginRequest) throws Exception {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(),
                                loginRequest.getPassword()
                        )
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Login Success");

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        response.setRole(USER_ROLE.valueOf(role));

        return response;
    }
}