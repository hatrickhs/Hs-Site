package com.HS.Controller;

import com.HS.Repository.VerificationCodeRepository;
import com.HS.Service.EmailService;
import com.HS.Service.SellerService;
import com.HS.Service.Service.AuthService;
import com.HS.Service.Service.SellerReportService;
import com.HS.Util.OtpUtil;
import com.HS.domine.AccountStatus;
import com.HS.exception.SellerException;
import com.HS.modal.Seller;
import com.HS.modal.SellerReport;
import com.HS.modal.VerificationCode;
import com.HS.request.LoginRequest;
import com.HS.response.ApiResponse;
import com.HS.response.AuthResponse;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
  @RequestMapping("/sellers")
public class SellerController {

    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
private final AuthService authService;
private final EmailService emailService;
private final SellerReportService sellerReportService;



@PostMapping("/login")
    public ResponseEntity<AuthResponse> LoginSeller(
            @RequestBody LoginRequest req
    ) throws Exception {
        String otp = req.getOtp();
        String email = req.getEmail();

        req.setEmail(email);
    System.out.println(otp+" - "+ email);
        AuthResponse authResponse= authService.signing(req);

        return ResponseEntity.ok(authResponse);
    }

//    @PatchMapping("/verify/{otp}")
//    public ResponseEntity<Seller>verifySellerEmail(@PathVariable String otp) throws Exception{
//
//    VerificationCode verificationCode= verificationCodeRepository.findByOtp(otp);
//
//    if (verificationCode == null || !verificationCode.getOtp().equals(otp)){
//        throw new Exception("wrong otp...");
//    }
//    Seller seller = sellerService.verifyEmail(verificationCode.getEmail(),otp);
//
//    return new ResponseEntity<>(seller, HttpStatus.OK);
//    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(
            @PathVariable String email,
            @PathVariable String otp) throws Exception {

        VerificationCode verificationCode =
                verificationCodeRepository.findTopByEmailOrderByIdDesc(email);

        if (verificationCode == null ||
                !verificationCode.getOtp().equals(otp)) {
            throw new Exception("wrong otp...");
        }

        Seller seller = sellerService.verifyEmail(email, otp);

        return new ResponseEntity<>(seller, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller)
            throws  Exception, MessagingException {
        Seller savedSeller = sellerService.createseller(seller);

        String otp = OtpUtil.generateOtp();
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(seller.getEmail());
        verificationCodeRepository.save(verificationCode);

        String subject = "hs Bazaar Email Verification Code";
        String text = "Welcome to hs Bazaar, verify your account using this link";
        String frontend_url = "http://localhost:3000/verify-seller/";
        emailService.sendVerificationOtpEmail(seller.getEmail(), verificationCode.getOtp(), subject, text + frontend_url);
        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

        @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException{
    Seller seller = sellerService.getSellerById(id);
    return  new ResponseEntity<>(seller, HttpStatus.OK);
        }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(
            @RequestHeader("Authorization") String jwtHeader) throws Exception {

        String jwt = jwtHeader.startsWith("Bearer ")
                ? jwtHeader.substring(7)
                : jwtHeader;

        Seller seller = sellerService.getSellerProfile(jwt);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }


    @GetMapping("/report")
    public ResponseEntity<SellerReport> getSellerReport(
            @RequestHeader("Authorization") String jwtHeader) throws Exception {

        String jwt = jwtHeader.startsWith("Bearer ")
                ? jwtHeader.substring(7)
                : jwtHeader;

        Seller seller = sellerService.getSellerProfile(jwt);
        SellerReport report = sellerReportService.getSellerReport(seller);

        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(
            @RequestParam(required = false) AccountStatus status){
    List<Seller> sellers = sellerService.getAllSeller(status);
    return ResponseEntity.ok(sellers);
        }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @RequestParam AccountStatus status) throws Exception {

        Seller updatedSeller =
                sellerService.updateSellerAccountStatus(id, status);

        return ResponseEntity.ok(updatedSeller);
    }

    @PatchMapping()
    public ResponseEntity<Seller> updateSeller(
            @RequestHeader("Authorization") String jwtHeader,
            @RequestBody Seller seller) throws Exception {

        String jwt = jwtHeader.startsWith("Bearer ")
                ? jwtHeader.substring(7)
                : jwtHeader;

        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);

        return ResponseEntity.ok(updatedSeller);
    }


@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteSeller(@PathVariable Long id ) throws Exception {

    sellerService.deleteSeller(id);
    return ResponseEntity.noContent().build();
}
}





