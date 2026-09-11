package org.restaurantfinder.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserResponseTest {

    @Test
    void shouldExposeUsername() {
        UserResponse userResponse = new UserResponse("octocat");

        assertEquals("octocat", userResponse.username());
    }

    @Test
    void shouldBeEqualForSameUsername() {
        assertEquals(new UserResponse("octocat"), new UserResponse("octocat"));
    }
}
