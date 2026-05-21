package com.HS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.HS")
@EnableAsync
public class EcommerceMultyvendorApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceMultyvendorApplication.class, args);
	}

}
