package org.restaurantfinder.backend.model;

import java.util.List;

public record RestaurantSearchResponse(GeocodedLocation location, List<Restaurant> restaurants) {
}
