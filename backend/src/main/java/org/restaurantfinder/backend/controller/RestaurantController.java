package org.restaurantfinder.backend.controller;

import jakarta.validation.constraints.NotBlank;
import org.restaurantfinder.backend.model.AddressSuggestion;
import org.restaurantfinder.backend.model.Restaurant;
import org.restaurantfinder.backend.model.RestaurantSearchResponse;
import org.restaurantfinder.backend.service.GeocodingService;
import org.restaurantfinder.backend.service.RestaurantService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@Validated
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final GeocodingService geocodingService;

    public RestaurantController(RestaurantService restaurantService, GeocodingService geocodingService) {
        this.restaurantService = restaurantService;
        this.geocodingService = geocodingService;
    }

    @GetMapping("/nearby")
    public List<Restaurant> getNearbyRestaurants(@RequestParam double lat,
                                                  @RequestParam double lon,
                                                  @RequestParam(defaultValue = "2000") int radius) {
        return restaurantService.getRestaurants(lon, lat, radius);
    }

    @GetMapping("/search")
    public RestaurantSearchResponse searchRestaurants(@RequestParam @NotBlank String address,
                                                        @RequestParam(defaultValue = "2000") int radius) {
        return restaurantService.searchByAddress(address, radius);
    }

    @GetMapping("/autocomplete")
    public List<AddressSuggestion> getAddressSuggestions(@RequestParam @NotBlank String text) {
        // Best-effort: on a slow/unreachable Geoapify response, show no suggestions rather than
        // an error - this is a per-keystroke convenience, not a result the user is waiting on.
        // Caught here rather than inside GeocodingService so the failed call isn't cached as if
        // it were a real "no suggestions" answer for this text.
        try {
            return geocodingService.autocomplete(text);
        } catch (ResourceAccessException exception) {
            return List.of();
        }
    }
}
