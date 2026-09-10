package org.restaurantfinder.backend.service;

import org.junit.jupiter.api.Test;
import org.restaurantfinder.backend.model.Favorite;
import org.restaurantfinder.backend.repository.FavoriteRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class FavoriteServiceTest {

    @Test
    void shouldAddFavorite() {

        FavoriteRepository favoriteRepository =
                mock(FavoriteRepository.class);

        Favorite favorite = new Favorite(
                null,
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

        when(favoriteRepository.existsByRestaurantId("restaurant-123"))
                .thenReturn(false);

        when(favoriteRepository.save(favorite))
                .thenReturn(savedFavorite);

        FavoriteService favoriteService =
                new FavoriteService(favoriteRepository);

        Favorite result = favoriteService.addFavorite(favorite);

        assertEquals(savedFavorite, result);

        verify(favoriteRepository).save(favorite);
    }

    @Test
    void shouldGetAllFavorites() {

        FavoriteRepository favoriteRepository =
                mock(FavoriteRepository.class);

        Favorite favorite = new Favorite(
                "mongo-id-123",
                "restaurant-123",
                "Test Restaurant",
                "Lister Meile 15, Hannover",
                "Italian",
                52.385,
                9.750
        );

        when(favoriteRepository.findAll())
                .thenReturn(java.util.List.of(favorite));

        FavoriteService favoriteService =
                new FavoriteService(favoriteRepository);

        var result = favoriteService.getAllFavorites();

        assertEquals(1, result.size());
        assertEquals(favorite, result.getFirst());

        verify(favoriteRepository).findAll();
    }

    @Test
    void shouldThrowExceptionWhenFavoriteAlreadyExists() {

        FavoriteRepository favoriteRepository =
                mock(FavoriteRepository.class);

        Favorite favorite = new Favorite(
                null,
                "restaurant-123",
                "Test Restaurant",
                "Lister Meile 15, Hannover",
                "Italian",
                52.385,
                9.750
        );

        when(favoriteRepository.existsByRestaurantId("restaurant-123"))
                .thenReturn(true);

        FavoriteService favoriteService =
                new FavoriteService(favoriteRepository);

        assertThrows(
                org.restaurantfinder.backend.exception.FavoriteAlreadyExistsException.class,
                () -> favoriteService.addFavorite(favorite)
        );

        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void shouldRemoveFavorite() {

        FavoriteRepository favoriteRepository =
                mock(FavoriteRepository.class);

        when(favoriteRepository.existsById("mongo-id-123"))
                .thenReturn(true);

        FavoriteService favoriteService =
                new FavoriteService(favoriteRepository);

        favoriteService.removeFavorite("mongo-id-123");

        verify(favoriteRepository).deleteById("mongo-id-123");
    }

    @Test
    void shouldThrowExceptionWhenFavoriteDoesNotExist() {

        FavoriteRepository favoriteRepository =
                mock(FavoriteRepository.class);

        when(favoriteRepository.existsById("mongo-id-123"))
                .thenReturn(false);

        FavoriteService favoriteService =
                new FavoriteService(favoriteRepository);

        assertThrows(
                org.restaurantfinder.backend.exception.FavoriteNotFoundException.class,
                () -> favoriteService.removeFavorite("mongo-id-123")
        );

        verify(favoriteRepository, never()).deleteById(anyString());
    }
}