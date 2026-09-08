package org.restaurantfinder.backend.model;

import lombok.Builder;

@Builder
public record AddressSuggestion(String formattedAddress, double lat, double lon) {
}
