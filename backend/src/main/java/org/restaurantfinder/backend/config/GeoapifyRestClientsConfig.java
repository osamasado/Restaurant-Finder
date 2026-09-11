package org.restaurantfinder.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.time.Duration;

// Builds one RestClient per Geoapify endpoint, each with its own connect/read timeout budget -
// none of them had any timeout before, so a slow/unresponsive response could hang a request
// thread indefinitely.
@Configuration
public class GeoapifyRestClientsConfig {

    private static final String GEOAPIFY_GEOCODING_URL = "https://api.geoapify.com/v1/geocode";
    private static final String GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places";
    private static final String GEOAPIFY_ROUTING_URL = "https://api.geoapify.com/v1/routing";

    // Geocoding backs the per-keystroke autocomplete field, so it gets the tightest budget.
    private static final Duration GEOCODING_CONNECT_TIMEOUT = Duration.ofMillis(500);
    private static final Duration GEOCODING_READ_TIMEOUT = Duration.ofMillis(2000);

    // Places/routing aren't on that per-keystroke path (and search chains a geocode call
    // before the places call), so they can afford a looser budget.
    private static final Duration DEFAULT_CONNECT_TIMEOUT = Duration.ofMillis(500);
    private static final Duration DEFAULT_READ_TIMEOUT = Duration.ofMillis(5000);

    @Bean
    public RestClient geocodingRestClient(RestClient.Builder restClientBuilder) {
        return restClientBuilder
                .baseUrl(GEOAPIFY_GEOCODING_URL)
                .requestFactory(GeoapifyClientHttpRequestFactories.withTimeouts(
                        GEOCODING_CONNECT_TIMEOUT, GEOCODING_READ_TIMEOUT))
                .build();
    }

    @Bean
    public RestClient placesRestClient(RestClient.Builder restClientBuilder) {
        return restClientBuilder
                .baseUrl(GEOAPIFY_PLACES_URL)
                .requestFactory(GeoapifyClientHttpRequestFactories.withTimeouts(
                        DEFAULT_CONNECT_TIMEOUT, DEFAULT_READ_TIMEOUT))
                .build();
    }

    @Bean
    public RestClient routingRestClient(RestClient.Builder restClientBuilder) {
        return restClientBuilder
                .baseUrl(GEOAPIFY_ROUTING_URL)
                .requestFactory(GeoapifyClientHttpRequestFactories.withTimeouts(
                        DEFAULT_CONNECT_TIMEOUT, DEFAULT_READ_TIMEOUT))
                .build();
    }
}
