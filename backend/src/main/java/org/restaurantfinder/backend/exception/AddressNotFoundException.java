package org.restaurantfinder.backend.exception;

public class AddressNotFoundException extends RuntimeException {

    public AddressNotFoundException(String address) {
        super("Could not find a specific street address for: " + address
                + ". Please include a street name.");
    }
}
