package org.restaurantfinder.backend.controller;

import org.junit.jupiter.api.Test;
import org.restaurantfinder.backend.model.UserResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoginControllerTest {

    @Test
    void shouldCreateLoginController() {
        LoginController loginController = new LoginController();

        assertNotNull(loginController);
    }

    @Test
    void shouldReturnCurrentUserFromGithubLoginAttribute() {
        OAuth2User oAuth2User = mock(OAuth2User.class);
        when(oAuth2User.getAttributes()).thenReturn(Map.of("login", "octocat"));

        LoginController loginController = new LoginController();

        UserResponse result = loginController.getMe(oAuth2User);

        assertEquals(new UserResponse("octocat"), result);
    }
}
