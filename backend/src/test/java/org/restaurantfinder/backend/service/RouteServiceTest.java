package org.restaurantfinder.backend.service;

import org.junit.jupiter.api.Test;

import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class RouteServiceTest {

    @Test
    void shouldCreateRouteService() {
        RestClient.Builder builder = RestClient.builder();

        RouteService routeService = new RouteService(builder, "test-key");

        assertNotNull(routeService);
    }
}
