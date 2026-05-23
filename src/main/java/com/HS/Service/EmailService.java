//package com.HS.Service;
//
//import jakarta.mail.internet.MimeMessage;
//import lombok.RequiredArgsConstructor;
//import org.springframework.mail.MailSendException;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//////@Service
//////@RequiredArgsConstructor
//////public class EmailService {
//////
//////    private final JavaMailSender javaMailSender;
//////
//////    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
//////        try {
//////            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//////            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");
//////
//////            mimeMessageHelper.setSubject(subject);
//////            mimeMessageHelper.setText(text, true);
//////            mimeMessageHelper.setTo(userEmail);
//////
//////            javaMailSender.send(mimeMessage);
//////
//////        } catch (Exception e) {
//////            System.out.println("error..."+e);
//////            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
//////        }
//////    }
//////}
////
////
////@Service
////@RequiredArgsConstructor
////public class EmailService {
////
////    private final JavaMailSender javaMailSender;
////
////    @Async
////    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
////        try {
////
////            System.out.println("MAIL HOST CHECK: smtp-relay.brevo.com");
////            System.out.println("MAIL USER: " + userEmail);
////
////            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
////            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
////
////            helper.setTo(userEmail);
////
//////            helper.setFrom("HS Bazaar <abd291001@smtp-brevo.com>");
////            helper.setFrom("abd291001@smtp-brevo.com", "HS Bazaar");
////
////            helper.setSubject(subject);
////            helper.setText(text, true);
////
////            javaMailSender.send(mimeMessage);
////
////            System.out.println("EMAIL SENT SUCCESSFULLY TO: " + userEmail);
////
////        } catch (Exception e) {
////            e.printStackTrace();
////            System.out.println("EMAIL ERROR: " + e.getMessage());
////            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
////        }
////    }
////}
//
//@Service
//@RequiredArgsConstructor
//public class EmailService {
//
//    private final JavaMailSender javaMailSender;
//
//    @Async
//    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
//        try {
//
//            System.out.println("MAIL HOST CHECK: smtp-relay.brevo.com");
//
//            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
//
//            helper.setTo(userEmail);
//            helper.setFrom("abd291001@smtp-brevo.com", "HS Bazaar");
//            helper.setSubject(subject);
//            helper.setText(text, true);
//
//            javaMailSender.send(mimeMessage);
//
//            System.out.println("EMAIL SENT SUCCESSFULLY TO: " + userEmail);
//
//        } catch (Exception e) {
//            System.out.println("EMAIL FAILED (IGNORED): " + e.getMessage());
//        }
//    }
//}

package com.HS.Service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Async
    public void sendVerificationOtpEmail(
            String userEmail,
            String otp,
            String subject,
            String text
    ) {

        try {

            OkHttpClient client = new OkHttpClient();

            String json = """
            {
              "sender":{
                "name":"HS Bazaar",
                "email":"abd291001@smtp-brevo.com"
              },
              "to":[
                {
                  "email":"%s"
                }
              ],
              "subject":"%s",
              "htmlContent":"%s"
            }
            """.formatted(userEmail, subject, text);

            RequestBody body = RequestBody.create(
                    json,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://api.brevo.com/v3/smtp/email")
                    .post(body)
                    .addHeader("accept", "application/json")
                    .addHeader(
                            "api-key",
                            System.getenv("BREVO_API_KEY")
                    )
                    .addHeader("content-type", "application/json")
                    .build();

            try (Response response = client.newCall(request).execute()) {

                System.out.println("BREVO RESPONSE: ");

                if (response.body() != null) {
                    System.out.println(response.body().string());
                }

                System.out.println("EMAIL SENT SUCCESSFULLY");
            }

        } catch (Exception e) {

            e.printStackTrace();

            System.out.println("EMAIL FAILED: " + e.getMessage());
        }
    }
}