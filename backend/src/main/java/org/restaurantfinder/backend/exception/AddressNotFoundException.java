package org.restaurantfinder.backend.exception;

public class AddressNotFoundException extends RuntimeException {

    public AddressNotFoundException(String address) {
        super("Could not find a location for address: " + address);
    }
}
