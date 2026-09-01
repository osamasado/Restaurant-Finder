package org.restaurantfinder.backend.service;

import org.restaurantfinder.backend.model.GeoapifyRoutingResponse;
import org.restaurantfinder.backend.model.Route;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    private final RestClient restClient;
    private final String apiKey;
    private static final String GEOAPIFY_ROUTING_URL =
            "https://api.geoapify.com/v1/routing";

    public RouteService(
            RestClient.Builder restClientBuilder,
            @Value("${geoapify.app.key}") String apiKey
    ) {
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

        if (response == null ||
                response.features() == null ||
                response.features().isEmpty()) {
            return null;
        }

        var properties = response.features().getFirst().properties();

        return new Route(
                properties.distance(),
                properties.time()
        );
    }
}