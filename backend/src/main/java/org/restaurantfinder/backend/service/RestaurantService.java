package org.restaurantfinder.backend.service;

import org.restaurantfinder.backend.model.GeoapifyPlacesResponse;
import org.restaurantfinder.backend.model.Restaurant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class RestaurantService {

    private final RestClient restClient;
    private final String apiKey;

    public RestaurantService(RestClient.Builder restClientBuilder,
                              @Value("${geoapify.app.key}") String apiKey) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.geoapify.com/v2/places")
                .build();
        this.apiKey = apiKey;
    }

    public List<Restaurant> getRestaurants(double lon, double lat, int radiusMeters) {
        GeoapifyPlacesResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("categories", "catering.restaurant")
                        .queryParam("filter", "circle:%s,%s,%d".formatted(lon, lat, radiusMeters))
                        .queryParam("bias", "proximity:%s,%s".formatted(lon, lat))
                        .queryParam("limit", 20)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .body(GeoapifyPlacesResponse.class);

        if (response == null || response.features() == null) {
            return List.of();
        }

        return response.features().stream()
                .map(this::toRestaurant)
                .toList();
    }

    private Restaurant toRestaurant(GeoapifyPlacesResponse.Feature feature) {
        var properties = feature.properties();
        var contact = properties.contact();
        var datasource = properties.datasource();
        var raw = datasource != null ? datasource.raw() : null;
        var geometry = feature.geometry();

        Double longitude = null;
        Double latitude = null;

        if (geometry != null && geometry.coordinates() != null && geometry.coordinates().size() >= 2) {
            longitude = geometry.coordinates().get(0);
            latitude = geometry.coordinates().get(1);
        }

        return Restaurant.builder()
                .id(properties.placeId())
                .name(properties.name())
                .address(properties.addressLine2())
                .phone(contact != null ? contact.phone() : null)
                .email(contact != null ? contact.email() : null)
                .website(properties.website())
                .openingHours(properties.openingHours())
                .distance(properties.distance())
                .cuisine(raw != null ? raw.cuisine() : null)
                .vegetarian(raw != null ? "yes".equalsIgnoreCase(raw.vegetarian()) : null)
                .vegan(raw != null ? "yes".equalsIgnoreCase(raw.vegan()) : null)
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }
}
