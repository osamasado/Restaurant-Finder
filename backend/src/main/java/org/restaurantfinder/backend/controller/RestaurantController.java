package org.restaurantfinder.backend.controller;

import org.restaurantfinder.backend.model.Restaurant;
import org.restaurantfinder.backend.service.RestaurantService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/nearby")
    public List<Restaurant> getNearbyRestaurants(@RequestParam double lat,
                                                  @RequestParam double lon,
                                                  @RequestParam(defaultValue = "2000") int radius) {
        return restaurantService.getRestaurants(lon, lat, radius);
    }
}
