package org.restaurantfinder.backend.controller;

import org.restaurantfinder.backend.model.UserResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @GetMapping
    public UserResponse getMe(@AuthenticationPrincipal OAuth2User user) {

        //return user.getName(); // gives Github ID
        String username = user
                .getAttributes()
                .get("login")
                .toString();

        return new UserResponse(username);
    }
}
