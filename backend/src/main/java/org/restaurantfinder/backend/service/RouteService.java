package org.restaurantfinder.backend.service;

import org.restaurantfinder.backend.model.GeoapifyRoutingResponse;
import org.restaurantfinder.backend.model.Route;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    private final RestClient restClient;
    private final String apiKey;

    public RouteService(
            @Qualifier("routingRestClient") RestClient restClient,
            @Value("${geoapify.app.key}") String apiKey
    ) {
        this.restClient = restClient;
        this.apiKey = apiKey;
    }

    public Route getRoute(
            double startLat,
            double startLon,
            double destinationLat,
            double destinationLon,
            String mode
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
                        .queryParam("mode", mode)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .body(GeoapifyRoutingResponse.class);

        if (response == null ||
                response.features() == null ||
                response.features().isEmpty()) {
            return null;
        }

        var feature = response.features().getFirst();
        var properties = feature.properties();
        var geometry = feature.geometry();

        return new Route(
                properties.distance(),
                properties.time(),
                geometry.coordinates().getFirst()
        );
    }
}