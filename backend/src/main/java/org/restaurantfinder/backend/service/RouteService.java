package org.restaurantfinder.backend.service;

import org.restaurantfinder.backend.model.GeoapifyRoutingResponse;
import org.restaurantfinder.backend.model.Route;
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

    public Route getRoute(
            double startLat,
            double startLon,
            double destinationLat,
            double destinationLon
    ) {
        GeoapifyRoutingResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam(
                                "waypoints",
                                "%s,%s|%s,%s".formatted(
                                        startLat,
                                        startLon,
                                        destinationLat,
                                        destinationLon
                                )
                        )
                        .queryParam("mode", "walk")
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .body(GeoapifyRoutingResponse.class);

        var properties = response.features().getFirst().properties();

        return new Route(
                properties.distance(),
                properties.time()
        );
    }
}