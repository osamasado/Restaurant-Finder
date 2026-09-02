package org.restaurantfinder.backend.model;

import java.util.List;

public record Route(
        int distance,
        double duration,
        List<List<Double>> coordinates
) {
}
