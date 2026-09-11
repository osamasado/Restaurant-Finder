package org.restaurantfinder.backend.controller;

import org.junit.jupiter.api.Test;
import org.restaurantfinder.backend.model.AddressSuggestion;
import org.restaurantfinder.backend.model.GeocodedLocation;
import org.restaurantfinder.backend.model.Restaurant;
import org.restaurantfinder.backend.model.RestaurantSearchResponse;
import org.restaurantfinder.backend.service.GeocodingService;
import org.restaurantfinder.backend.service.RestaurantService;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RestaurantControllerTest {

    @Test
    void shouldCreateRestaurantController() {
        RestaurantService restaurantService = mock(RestaurantService.class);
        GeocodingService geocodingService = mock(GeocodingService.class);

        RestaurantController restaurantController = new RestaurantController(restaurantService, geocodingService);

        assertNotNull(restaurantController);
    }

    @Test
    void shouldReturnSearchResponse() {
        RestaurantService restaurantService = mock(RestaurantService.class);
        GeocodingService geocodingService = mock(GeocodingService.class);

        RestaurantSearchResponse expected = new RestaurantSearchResponse(
                GeocodedLocation.builder().lat(52.520008).lon(13.404954).build(),
                List.of(Restaurant.builder().id("abc123").name("BLOCK HOUSE").build())
        );

        when(restaurantService.searchByAddress("Alexanderplatz, Berlin", 2000)).thenReturn(expected);

        RestaurantController restaurantController = new RestaurantController(restaurantService, geocodingService);

        RestaurantSearchResponse actual = restaurantController.searchRestaurants("Alexanderplatz, Berlin", 2000);

        assertEquals(expected, actual);
    }

    @Test
    void shouldReturnAddressSuggestions() {
        RestaurantService restaurantService = mock(RestaurantService.class);
        GeocodingService geocodingService = mock(GeocodingService.class);

        List<AddressSuggestion> expected = List.of(
                AddressSuggestion.builder()
                        .formattedAddress("Alexanderplatz, 10178 Berlin, Germany")
                        .lat(52.5219814)
                        .lon(13.4132147)
                        .build()
        );

        when(geocodingService.autocomplete("Alexander")).thenReturn(expected);

        RestaurantController restaurantController = new RestaurantController(restaurantService, geocodingService);

        List<AddressSuggestion> actual = restaurantController.getAddressSuggestions("Alexander");

        assertEquals(expected, actual);
    }

    @Test
    void shouldReturnEmptySuggestionsWhenGeoapifyTimesOut() {
        RestaurantService restaurantService = mock(RestaurantService.class);
        GeocodingService geocodingService = mock(GeocodingService.class);

        when(geocodingService.autocomplete("Alexander"))
                .thenThrow(new ResourceAccessException("Request cancelled"));

        RestaurantController restaurantController = new RestaurantController(restaurantService, geocodingService);

        List<AddressSuggestion> actual = restaurantController.getAddressSuggestions("Alexander");

        assertTrue(actual.isEmpty());
    }
}
