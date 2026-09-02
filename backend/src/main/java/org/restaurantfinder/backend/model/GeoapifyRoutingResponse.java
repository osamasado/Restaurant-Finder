package org.restaurantfinder.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeoapifyRoutingResponse(List<Feature> features) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Feature(
            Properties properties,
            Geometry geometry
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Properties(
            int distance,
            double time
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Geometry(
            String type,
            List<List<List<Double>>> coordinates
    ) {
    }
}