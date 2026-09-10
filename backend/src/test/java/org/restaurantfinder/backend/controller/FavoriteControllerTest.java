package org.restaurantfinder.backend.controller;

import org.junit.jupiter.api.Test;
import org.restaurantfinder.backend.model.Favorite;
import org.restaurantfinder.backend.model.FavoriteRequest;
import org.restaurantfinder.backend.service.FavoriteService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class FavoriteControllerTest {

    @Test
    void shouldCreateFavoriteController() {
        FavoriteService favoriteService = mock(FavoriteService.class);

        FavoriteController favoriteController =
                new FavoriteController(favoriteService);

        assertNotNull(favoriteController);
    }

    @Test
    void shouldAddFavorite() {
        FavoriteService favoriteService = mock(FavoriteService.class);

        FavoriteRequest request = new FavoriteRequest(
                "restaurant-123",
                "Test Restaurant",
                "Lister Meile 15, Hannover",
                "Italian",
                52.385,
                9.750
        );

        Favorite savedFavorite = new Favorite(
                "mongo-id-123",
                "restaurant-123",
                "Test Restaurant",
                "Lister Meile 15, Hannover",
                "Italian",
                52.385,
                9.750
        );

        when(favoriteService.addFavorite(any(Favorite.class)))
                .thenReturn(savedFavorite);

        FavoriteController favoriteController =
                new FavoriteController(favoriteService);

        Favorite result =
                favoriteController.addFavorite(request);

        assertEquals(savedFavorite, result);
    }

    @Test
    void shouldReturnAllFavorites() {
        FavoriteService favoriteService = mock(FavoriteService.class);

        Favorite favorite = new Favorite(
                "mongo-id-123",
                "restaurant-123",
                "Test Restaurant",
                "Lister Meile 15, Hannover",
                "Italian",
                52.385,
                9.750
        );

        when(favoriteService.getAllFavorites())
                .thenReturn(List.of(favorite));

        FavoriteController favoriteController =
                new FavoriteController(favoriteService);

        List<Favorite> result =
                favoriteController.getAllFavorites();

        assertEquals(1, result.size());
        assertEquals(favorite, result.getFirst());
    }

    @Test
    void shouldRemoveFavorite() {
        FavoriteService favoriteService = mock(FavoriteService.class);

        FavoriteController favoriteController =
                new FavoriteController(favoriteService);

        favoriteController.removeFavorite("mongo-id-123");

        verify(favoriteService)
                .removeFavorite("mongo-id-123");
    }
}