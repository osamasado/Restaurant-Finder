package org.restaurantfinder.backend.service;

import org.junit.jupiter.api.Test;

import org.restaurantfinder.backend.model.Route;
import org.restaurantfinder.backend.model.GeoapifyRoutingResponse;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class RouteServiceTest {

    @Test
    void shouldCreateRouteService() {
        RestClient.Builder builder = RestClient.builder();

        RouteService routeService = new RouteService(builder, "test-key");

        assertNotNull(routeService);
    }

    @Test
    void shouldReturnRouteWithDistanceAndDuration() {
        Route route = new Route(39, 36.2);

        assertEquals(39, route.distance());
        assertEquals(36.2, route.duration());
    }

    @Test
    void shouldCreateGeoapifyRoutingResponse() {
        GeoapifyRoutingResponse.Properties properties =
                new GeoapifyRoutingResponse.Properties(39, 36.2);

        assertEquals(39, properties.distance());
        assertEquals(36.2, properties.time());
    }
}
