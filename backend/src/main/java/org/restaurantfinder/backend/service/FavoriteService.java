package org.restaurantfinder.backend.service;

import org.restaurantfinder.backend.exception.FavoriteAlreadyExistsException;
import org.restaurantfinder.backend.exception.FavoriteNotFoundException;
import org.restaurantfinder.backend.model.Favorite;
import org.restaurantfinder.backend.repository.FavoriteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    public Favorite addFavorite(Favorite favorite) {

        if (favoriteRepository.existsByRestaurantId(favorite.restaurantId())) {
            //throw new IllegalArgumentException("Restaurant is already saved as favorite");
            throw new FavoriteAlreadyExistsException("Restaurant is already saved as favorite");
        }

        return favoriteRepository.save(favorite);
    }

    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    public void removeFavorite(String id) {
        if (!favoriteRepository.existsById(id)) {
            throw new FavoriteNotFoundException(
                    "Favorite restaurant not found"
            );
        }

        favoriteRepository.deleteById(id);
    }


}
