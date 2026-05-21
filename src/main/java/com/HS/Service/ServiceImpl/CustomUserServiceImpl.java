package com.HS.Service.ServiceImpl;

import com.HS.Repository.SellerRepository;
import com.HS.Repository.UserRepository;
import com.HS.domine.USER_ROLE;
import com.HS.modal.Seller;
import com.HS.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomUserServiceImpl  implements UserDetailsService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private static final String SELLER_PREFIX="seller_";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First check seller table directly
        Seller seller = sellerRepository.findByEmail(username);
        if (seller != null) {
            return buildUserDetails(seller.getEmail(), seller.getPassword(), seller.getRole());
        }

        // Then check user table
        User user = userRepository.findByEmail(username);
        if (user != null) {
            return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
        }

        throw new UsernameNotFoundException("user or seller not found with email "+username);
    }


    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
    if(role==null) role=USER_ROLE.ROLE_CUSTOMER;

        List<GrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(role.toString()));

        return new org.springframework.security.core.userdetails.User(
                email,
                password,
                authorityList);

    }
}
