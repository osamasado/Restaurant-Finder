package org.restaurantfinder.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("favorites")
public record Favorite(
        @Id
        String id,
        String restaurantId,
        String name,
        String address,
        String cuisine,
        double latitude,
        double longitude
) {
}
