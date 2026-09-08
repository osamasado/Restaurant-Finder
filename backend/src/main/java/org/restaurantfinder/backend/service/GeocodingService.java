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
import java.util.Set;

@Service
public class GeocodingService {

    private final RestClient restClient;
    private final String apiKey;
    private static final String GEOAPIFY_GEOCODING_URL =
            "https://api.geoapify.com/v1/geocode";

    // Geoapify's result_type for a match that only narrowed down to an administrative
    // area or postal code, not an actual place - too imprecise to search "near".
    private static final Set<String> VAGUE_RESULT_TYPES =
            Set.of("country", "state", "county", "city", "postcode");

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

        // Reject results that only narrowed down to a city/postcode/country level -
        // those land on an arbitrary point within that area rather than a real place.
        if (isVague(properties.resultType())) {
            return Optional.empty();
        }

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
                .filter(feature -> !isVague(feature.properties().resultType()))
                .map(feature -> AddressSuggestion.builder()
                        .formattedAddress(feature.properties().formatted())
                        .lat(feature.properties().lat())
                        .lon(feature.properties().lon())
                        .build())
                .toList();
    }

    // Missing result_type is treated as vague too - we can't confirm it's a specific place.
    private boolean isVague(String resultType) {
        return resultType == null || VAGUE_RESULT_TYPES.contains(resultType);
    }
}
