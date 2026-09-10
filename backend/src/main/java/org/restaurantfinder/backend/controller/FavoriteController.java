package org.restaurantfinder.backend.controller;

import org.restaurantfinder.backend.model.Favorite;
import org.restaurantfinder.backend.model.FavoriteRequest;
import org.restaurantfinder.backend.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")

public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Favorite addFavorite(@RequestBody FavoriteRequest request) {

        Favorite favorite = new Favorite(
                null,
                request.restaurantId(),
                request.name(),
                request.address(),
                request.cuisine(),
                request.latitude(),
                request.longitude()
        );

        return favoriteService.addFavorite(favorite);
    }

    @GetMapping
    public List<Favorite> getAllFavorites() {
        return favoriteService.getAllFavorites();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(@PathVariable String id) {
        favoriteService.removeFavorite(id);
    }
}
