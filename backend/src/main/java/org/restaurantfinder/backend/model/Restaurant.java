package org.restaurantfinder.backend.model;

import lombok.Builder;

@Builder
public record Restaurant(
        String id,
        String name,
        String address,
        String phone,
        String email,
        String website,
        String openingHours,
        Integer distance,
        String cuisine,
        Boolean vegetarian,
        Boolean vegan,
        Double latitude,
        Double longitude
) {
}