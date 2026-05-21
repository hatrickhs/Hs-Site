package com.HS.Service.ServiceImpl;

import com.HS.Repository.UserRepository;
import com.HS.domine.USER_ROLE;
import com.HS.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Datainitialization implements CommandLineRunner {

    private  final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializedAdminUser();

    }

    private void initializedAdminUser() {
        String adminUsername = "hatrickhs597@gmail,com";

        if (userRepository.findByEmail(adminUsername) == null) {

            User adminUser = new User();

            adminUser.setPassword(passwordEncoder.encode("codewithhs"));
            adminUser.setFullName("Hs");
            adminUser.setEmail(adminUsername);
            adminUser.setRole(USER_ROLE.ROLE_ADMIN);


             userRepository.save(adminUser);


        }
    }
}
