package com.HS.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

//@Service
//@RequiredArgsConstructor
//public class EmailService {
//
//    private final JavaMailSender javaMailSender;
//
//    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
//        try {
//            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");
//
//            mimeMessageHelper.setSubject(subject);
//            mimeMessageHelper.setText(text, true);
//            mimeMessageHelper.setTo(userEmail);
//
//            javaMailSender.send(mimeMessage);
//
//        } catch (Exception e) {
//            System.out.println("error..."+e);
//            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
//        }
//    }
//}


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
        try {

            System.out.println("MAIL HOST CHECK: smtp-relay.brevo.com");
            System.out.println("MAIL USER: " + userEmail);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(userEmail);

            // 🔥 IMPORTANT FIX
//            helper.setFrom("HS Bazaar <abd291001@smtp-brevo.com>");
            helper.setFrom("HS Bazaar <hatrickhs594@gmail.com>");

            helper.setSubject(subject);
            helper.setText(text, true);

            javaMailSender.send(mimeMessage);

            System.out.println("EMAIL SENT SUCCESSFULLY TO: " + userEmail);

        } catch (Exception e) {
            System.out.println("EMAIL ERROR: " + e.getMessage());
            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
        }
    }
}