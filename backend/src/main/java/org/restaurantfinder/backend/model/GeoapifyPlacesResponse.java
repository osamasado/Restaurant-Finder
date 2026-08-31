package org.restaurantfinder.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeoapifyPlacesResponse(List<Feature> features) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Feature(Properties properties) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Properties(
            @JsonProperty("place_id") String placeId,
            String name,
            @JsonProperty("address_line2") String addressLine2,
            Contact contact
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Contact(String phone, String email) {
    }
}
