package org.restaurantfinder.backend.controller;

import org.restaurantfinder.backend.model.Route;
import org.restaurantfinder.backend.service.RouteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public Route getRoute(
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double destinationLat,
            @RequestParam double destinationLon,
            @RequestParam(defaultValue = "walk") String mode
    ) {
        return routeService.getRoute(
                startLat,
                startLon,
                destinationLat,
                destinationLon,
                mode
        );
    }
}
