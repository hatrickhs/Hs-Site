package com.HS.Service.ServiceImpl;

import com.HS.Repository.AddressRepository;
import com.HS.Repository.SellerRepository;
import com.HS.Repository.UserRepository;
import com.HS.Security.JwtProvider;
import com.HS.Service.SellerService;
import com.HS.domine.AccountStatus;
import com.HS.domine.USER_ROLE;
import com.HS.exception.SellerException;
import com.HS.modal.Address;
import com.HS.modal.Seller;
import com.HS.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;


    public static class SellerNotFoundException extends RuntimeException {
        public SellerNotFoundException(String message) {
            super(message);
        }
    }

    @Override
    public Seller getSellerProfile(String jwt) throws SellerNotFoundException {
        System.out.println("JWT RECEIVED = " + jwt);
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        System.out.println("EMAIL FROM JWT = " + email);

        return getSellerByEmail(email);
    }


//    @Override
//    public Seller createseller(Seller seller) throws SellerNotFoundException {
//        Seller sellerExist = sellerRepository.findByEmail(seller.getEmail());
//        if (sellerExist != null) {
//            throw new SellerNotFoundException("Seller already exists with email: " + seller.getEmail());
//        }
//
//        Address savedAddress = addressRepository.save(seller.getPickupAddress());
//
//        Seller newSeller = new Seller();
//        newSeller.setEmail(seller.getEmail());
//        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
//        newSeller.setSellerName(seller.getSellerName());
//        newSeller.setPickupAddress(savedAddress);
//        newSeller.setGSTIN(seller.getGSTIN());
//        newSeller.setRole(USER_ROLE.ROLE_SELLER);
//        newSeller.setMobile(seller.getMobile());
//        newSeller.setBankDetails(seller.getBankDetails());
//        newSeller.setBusinessDetails(seller.getBusinessDetails());
//
//        return sellerRepository.save(newSeller);
//    }

    @Override
    public Seller createseller(Seller seller) throws SellerException {

        // 1. Seller already exists check
        Seller existingSeller = sellerRepository.findByEmail(seller.getEmail());
        if (existingSeller != null) {
            throw new RuntimeException("Seller already exists");
        }

        // 2. Save address first
        Address savedAddress = null;
        if (seller.getPickupAddress() != null) {
            savedAddress = addressRepository.save(seller.getPickupAddress());
        }

        // 3. Create Seller
        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(savedAddress);
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());
        newSeller.setAccountStatus(AccountStatus.ACTIVE);

        Seller savedSeller = sellerRepository.save(newSeller);

        // 4. Create User (SAFE)
        User userExist = userRepository.findByEmail(savedSeller.getEmail());

        if (userExist == null) {
            User user = new User();
            user.setEmail(savedSeller.getEmail());
            user.setPassword(savedSeller.getPassword());
            user.setFullName(
                    savedSeller.getSellerName() != null
                            ? savedSeller.getSellerName()
                            : "Seller"
            );
            user.setMobile(savedSeller.getMobile());
            user.setRole(USER_ROLE.ROLE_SELLER);

            // avoid null crash
            user.setAddresses(new HashSet<>());
            user.setUsedCoupons(new HashSet<>());

            userRepository.save(user);
        }

        return savedSeller;
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new SellerException ("Seller not found with id: " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws SellerNotFoundException {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new SellerNotFoundException("Seller not found with email: " + email);
        }
        return seller;
    }

//    @Override
//    public List<Seller> getAllSeller(AccountStatus status) {
//        return sellerRepository.findByAccountStatus(status);
//    }

    @Override
    public List<Seller> getAllSeller(AccountStatus status) {

        if (status == null || status.name().equals("ALL")) {
            return sellerRepository.findAll();
        }

        return sellerRepository.findByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws SellerException {
        Seller existingSeller = getSellerById(id);

        if (seller.getSellerName() != null) existingSeller.setSellerName(seller.getSellerName());
        if (seller.getMobile() != null) existingSeller.setMobile(seller.getMobile());
        if (seller.getEmail() != null) existingSeller.setEmail(seller.getEmail());

        if (seller.getBusinessDetails() != null && seller.getBusinessDetails().getBusinessName() != null) {
            existingSeller.getBusinessDetails().setBusinessName(seller.getBusinessDetails().getBusinessName());
        }

        if (seller.getBankDetails() != null) {
            if (seller.getBankDetails().getAccountHolderName() != null)
                existingSeller.getBankDetails().setAccountHolderName(seller.getBankDetails().getAccountHolderName());
            if (seller.getBankDetails().getAccountNumber() != null)
                existingSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
            if (seller.getBankDetails().getIfscCode() != null)
                existingSeller.getBankDetails().setIfscCode(seller.getBankDetails().getIfscCode());
        }

        if (seller.getPickupAddress() != null) {
            if (seller.getPickupAddress().getAddress() != null)
                existingSeller.getPickupAddress().setAddress(seller.getPickupAddress().getAddress());
            if (seller.getPickupAddress().getMobile() != null)
                existingSeller.getPickupAddress().setMobile(seller.getPickupAddress().getMobile());
            if (seller.getPickupAddress().getCity() != null)
                existingSeller.getPickupAddress().setCity(seller.getPickupAddress().getCity());
            if (seller.getPickupAddress().getState() != null)
                existingSeller.getPickupAddress().setState(seller.getPickupAddress().getState());
        }

        if (seller.getGSTIN() != null) existingSeller.setGSTIN(seller.getGSTIN());

        return sellerRepository.save(existingSeller);
    }

    @Override
    public void deleteSeller(Long id) throws SellerException {
        Seller seller = getSellerById(id);
        sellerRepository.delete(seller);
    }

    @Override
    public Seller verifyEmail(String email, String otp)  {
        Seller seller = getSellerByEmail(email);
        seller.setEmailVerified(true);
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws SellerException {
        Seller seller = getSellerById(sellerId);
        seller.setAccountStatus(status);
        return sellerRepository.save(seller);
    }
}
