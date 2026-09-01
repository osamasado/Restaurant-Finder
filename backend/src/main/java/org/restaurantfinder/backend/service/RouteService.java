package org.restaurantfinder.backend.service;

import org.springframework.web.client.RestClient;

public class RouteService {

    private final RestClient restClient;
    private final String apiKey;
    private static final String GEOAPIFY_ROUTING_URL =
            "https://api.geoapify.com/v1/routing";

    public RouteService(RestClient.Builder restClientBuilder, String apiKey) {
        this.restClient = restClientBuilder
                .baseUrl(GEOAPIFY_ROUTING_URL)
                .build();

        this.apiKey = apiKey;
    }
}