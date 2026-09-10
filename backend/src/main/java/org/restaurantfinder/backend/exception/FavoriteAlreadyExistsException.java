package org.restaurantfinder.backend.exception;

public class FavoriteAlreadyExistsException extends RuntimeException {

    public FavoriteAlreadyExistsException(String message) {
        super(message);
    }
}
