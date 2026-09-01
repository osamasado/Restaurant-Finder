package org.restaurantfinder.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeoapifyPlacesResponse(List<Feature> features) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Feature(
            Properties properties,
            Geometry geometry
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Properties(
            @JsonProperty("place_id") String placeId,
            String name,
            @JsonProperty("address_line2") String addressLine2,
            Contact contact,
            String website,
            @JsonProperty("opening_hours") String openingHours,
            Integer distance,
            Datasource datasource
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Contact(
            String phone,
            String email
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Datasource(Raw raw) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Raw(
            String cuisine,
            String vegetarian,
            String vegan
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Geometry(List<Double> coordinates) {
    }
}