package org.restaurantfinder.backend.repository;

import org.restaurantfinder.backend.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    boolean existsByRestaurantId(String restaurantId);
}
