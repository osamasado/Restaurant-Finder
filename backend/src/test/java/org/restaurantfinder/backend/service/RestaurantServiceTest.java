package org.restaurantfinder.backend.service;

import org.junit.jupiter.api.Test;

import org.restaurantfinder.backend.model.Restaurant;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class RestaurantServiceTest {

    @Test
    void shouldCreateRestaurantService() {
        RestClient.Builder builder = RestClient.builder();

        RestaurantService restaurantService = new RestaurantService(builder, "test-key");

        assertNotNull(restaurantService);
    }

    @Test
    void shouldMapFullFeatureToRestaurant() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "place_id": "abc123",
                "name": "BLOCK HOUSE",
                "address_line2": "Karl-Liebknecht-Straße 7, 10178 Berlin, Germany",
                "contact": {
                  "phone": "+49 30 2423300",
                  "email": "info@block-house.de"
                },
                "website": "http://www.block-house.de",
                "opening_hours": "Mo-Sa 12:00-23:00",
                "distance": 60,
                "datasource": {
                  "raw": {
                    "cuisine": "steak_house",
                    "vegetarian": "yes",
                    "vegan": "no"
                  }
                }
              },
              "geometry": {
                "coordinates": [13.4051631, 52.5205315]
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        RestaurantService restaurantService = new RestaurantService(builder, "test-key");

        List<Restaurant> restaurants = restaurantService.getRestaurants(13.404954, 52.520008, 2000);

        assertEquals(1, restaurants.size());

        Restaurant restaurant = restaurants.get(0);
        assertEquals("abc123", restaurant.id());
        assertEquals("BLOCK HOUSE", restaurant.name());
        assertEquals("Karl-Liebknecht-Straße 7, 10178 Berlin, Germany", restaurant.address());
        assertEquals("+49 30 2423300", restaurant.phone());
        assertEquals("info@block-house.de", restaurant.email());
        assertEquals("http://www.block-house.de", restaurant.website());
        assertEquals("Mo-Sa 12:00-23:00", restaurant.openingHours());
        assertEquals(60, restaurant.distance());
        assertEquals("steak_house", restaurant.cuisine());
        assertTrue(restaurant.vegetarian());
        assertFalse(restaurant.vegan());
        assertEquals(13.4051631, restaurant.longitude());
        assertEquals(52.5205315, restaurant.latitude());
    }

    @Test
    void shouldMapFeatureWithoutContactOrDatasourceToNullFields() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "place_id": "def456",
                "name": "San Ena",
                "address_line2": "Karl-Liebknecht-Straße 3, 10178 Berlin, Germany",
                "distance": 185
              },
              "geometry": {
                "coordinates": [13.4025003, 52.5193436]
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        RestaurantService restaurantService = new RestaurantService(builder, "test-key");

        List<Restaurant> restaurants = restaurantService.getRestaurants(13.404954, 52.520008, 2000);

        assertEquals(1, restaurants.size());

        Restaurant restaurant = restaurants.get(0);
        assertNull(restaurant.phone());
        assertNull(restaurant.email());
        assertNull(restaurant.cuisine());
        assertNull(restaurant.vegetarian());
        assertNull(restaurant.vegan());
    }

    @Test
    void shouldReturnEmptyListWhenNoFeaturesFound() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
            {
              "features": []
            }
            """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        RestaurantService restaurantService = new RestaurantService(builder, "test-key");

        List<Restaurant> restaurants = restaurantService.getRestaurants(13.404954, 52.520008, 2000);

        assertTrue(restaurants.isEmpty());
    }

    @Test
    void shouldReturnEmptyListWhenResponseHasNoFeaturesField() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        server.expect(request -> {})
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        RestaurantService restaurantService = new RestaurantService(builder, "test-key");

        List<Restaurant> restaurants = restaurantService.getRestaurants(13.404954, 52.520008, 2000);

        assertTrue(restaurants.isEmpty());
    }
}
