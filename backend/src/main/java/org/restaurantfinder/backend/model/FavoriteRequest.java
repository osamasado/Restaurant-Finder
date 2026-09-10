package org.restaurantfinder.backend.model;

public record FavoriteRequest(
        String restaurantId,
        String name,
        String address,
        String cuisine,
        double latitude,
        double longitude
) {
}