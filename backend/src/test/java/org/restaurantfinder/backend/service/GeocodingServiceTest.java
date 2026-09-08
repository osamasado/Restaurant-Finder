package org.restaurantfinder.backend.service;

import org.junit.jupiter.api.Test;
import org.restaurantfinder.backend.model.AddressSuggestion;
import org.restaurantfinder.backend.model.GeocodedLocation;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class GeocodingServiceTest {

    @Test
    void shouldGeocodeAddressToLocation() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "formatted": "Alexanderplatz, 10178 Berlin, Germany",
                "lat": 52.5219814,
                "lon": 13.4132147
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder, "test-key");

        Optional<GeocodedLocation> location = geocodingService.geocode("Alexanderplatz, Berlin");

        assertTrue(location.isPresent());
        assertEquals(52.5219814, location.get().lat());
        assertEquals(13.4132147, location.get().lon());
    }

    @Test
    void shouldReturnEmptyWhenAddressHasNoResults() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        server.expect(request -> {})
                .andRespond(withSuccess("""
                        { "features": [] }
                        """, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder, "test-key");

        Optional<GeocodedLocation> location = geocodingService.geocode("asdkjasdlkj123");

        assertTrue(location.isEmpty());
    }

    @Test
    void shouldMapAutocompleteSuggestions() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "formatted": "Alexanderplatz, 10178 Berlin, Germany",
                "lat": 52.5219814,
                "lon": 13.4132147
              }
            },
            {
              "properties": {
                "formatted": "Alexanderstraße, 10178 Berlin, Germany",
                "lat": 52.5210,
                "lon": 13.4140
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder, "test-key");

        List<AddressSuggestion> suggestions = geocodingService.autocomplete("Alexander");

        assertEquals(2, suggestions.size());
        assertEquals("Alexanderplatz, 10178 Berlin, Germany", suggestions.get(0).formattedAddress());
        assertEquals(52.5219814, suggestions.get(0).lat());
    }
}
