package org.restaurantfinder.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AddressNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleAddressNotFound(AddressNotFoundException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    // Thrown by RestClient when a Geoapify call times out or otherwise fails at the I/O level
    // (see the per-service connect/read timeouts in GeoapifyRestClientsConfig). Expected under
    // normal operation when Geoapify is slow/unreachable, so log a short message rather than the
    // full stack trace the default unhandled-exception path would otherwise produce.
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, String>> handleGeoapifyUnavailable(ResourceAccessException exception) {
        log.warn("Geoapify request failed: {}", exception.getMessage());
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", "The address lookup service is temporarily unavailable. Please try again."));
    }
}
