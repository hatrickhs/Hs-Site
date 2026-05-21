package com.HS.Controller;

import com.HS.Service.Service.UserService;
import com.HS.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> UserProfileHandler( @RequestHeader("Authorization")
                                                       String jwt) throws Exception {

User user = userService.findUserByJwtToken(jwt);

        return ResponseEntity.ok(user);
    }
}
