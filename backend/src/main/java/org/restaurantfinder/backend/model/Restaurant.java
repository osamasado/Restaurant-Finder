package org.restaurantfinder.backend.model;

import lombok.Builder;

@Builder
public record Restaurant(String id, String name, String address, String phone, String email) {
}
