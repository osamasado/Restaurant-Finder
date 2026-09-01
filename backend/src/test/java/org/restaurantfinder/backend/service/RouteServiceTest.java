package org.restaurantfinder.backend.service;

import org.junit.jupiter.api.Test;

import org.restaurantfinder.backend.model.Route;
import org.restaurantfinder.backend.model.GeoapifyRoutingResponse;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

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

    @Test
    void shouldReturnDistanceAndDurationFromGeoapify() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
            {
              "features": [
                {
                  "properties": {
                    "distance": 39,
                    "time": 36.2
                  }
                }
              ]
            }
            """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        RouteService routeService = new RouteService(builder, "test-key");

        Route route = routeService.getRoute(
                52.3809821,
                9.7450007,
                52.3812597,
                9.7447447
        );

        assertEquals(39, route.distance());
        assertEquals(36.2, route.duration());
    }

    @Test
    void shouldReturnNullWhenGeoapifyReturnsNoRoute() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
            {
              "features": []
            }
            """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        RouteService routeService = new RouteService(builder, "test-key");

        Route route = routeService.getRoute(
                52.3809821,
                9.7450007,
                52.3812597,
                9.7447447
        );

        assertNull(route);
    }
}
