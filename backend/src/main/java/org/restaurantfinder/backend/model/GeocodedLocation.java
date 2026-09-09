package org.restaurantfinder.backend.model;

import lombok.Builder;

@Builder
public record GeocodedLocation(double lat, double lon) {
}
