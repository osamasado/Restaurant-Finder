package org.restaurantfinder.backend.service;

import org.restaurantfinder.backend.model.AddressSuggestion;
import org.restaurantfinder.backend.model.GeoapifyGeocodingResponse;
import org.restaurantfinder.backend.model.GeocodedLocation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

@Service
public class GeocodingService {

    private final RestClient restClient;
    private final String apiKey;
    private static final String GEOAPIFY_GEOCODING_URL =
            "https://api.geoapify.com/v1/geocode";

    public GeocodingService(RestClient.Builder restClientBuilder,
                             @Value("${geoapify.app.key}") String apiKey) {
        this.restClient = restClientBuilder
                .baseUrl(GEOAPIFY_GEOCODING_URL)
                .build();
        this.apiKey = apiKey;
    }

    @Cacheable("geocodedAddresses")
    public Optional<GeocodedLocation> geocode(String address) {
        GeoapifyGeocodingResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("text", address)
                        .queryParam("limit", 1)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .body(GeoapifyGeocodingResponse.class);

        if (response == null || response.features() == null || response.features().isEmpty()) {
            return Optional.empty();
        }

        var properties = response.features().getFirst().properties();

        return Optional.of(GeocodedLocation.builder()
                .lat(properties.lat())
                .lon(properties.lon())
                .build());
    }

    @Cacheable("addressSuggestions")
    public List<AddressSuggestion> autocomplete(String text) {
        GeoapifyGeocodingResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/autocomplete")
                        .queryParam("text", text)
                        .queryParam("limit", 5)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .body(GeoapifyGeocodingResponse.class);

        if (response == null || response.features() == null) {
            return List.of();
        }

        return response.features().stream()
                .map(feature -> AddressSuggestion.builder()
                        .formattedAddress(feature.properties().formatted())
                        .lat(feature.properties().lat())
                        .lon(feature.properties().lon())
                        .build())
                .toList();
    }
}
