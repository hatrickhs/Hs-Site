
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
                "email":"hatrickhs594@gmail.com"
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