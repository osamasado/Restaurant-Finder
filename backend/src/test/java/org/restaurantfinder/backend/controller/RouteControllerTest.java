package org.restaurantfinder.backend.controller;

import org.restaurantfinder.backend.model.Route;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.restaurantfinder.backend.service.RouteService;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;

class RouteControllerTest {

    @Test
    void shouldCreateRouteController() {
        RouteService routeService = mock(RouteService.class);

        RouteController routeController = new RouteController(routeService);

        assertNotNull(routeController);
    }

    @Test
    void shouldReturnRoute() {
        RouteService routeService = mock(RouteService.class);

        Route expectedRoute = new Route(
                39,
                36.2,
                java.util.List.of(
                        java.util.List.of(9.7450007, 52.3809821),
                        java.util.List.of(9.7447447, 52.3812597)
                )
        );

        when(routeService.getRoute(
                52.3809821,
                9.7450007,
                52.3812597,
                9.7447447,
                "walk"
        )).thenReturn(expectedRoute);

        RouteController routeController = new RouteController(routeService);

        Route actualRoute = routeController.getRoute(
                52.3809821,
                9.7450007,
                52.3812597,
                9.7447447,
                "walk"
        );

        assertEquals(expectedRoute, actualRoute);
    }
}
