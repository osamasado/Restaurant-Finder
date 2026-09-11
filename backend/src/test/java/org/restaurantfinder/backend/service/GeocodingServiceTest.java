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
                "lon": 13.4132147,
                "result_type": "amenity"
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder.baseUrl("http://localhost").build(), "test-key");

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

        GeocodingService geocodingService = new GeocodingService(builder.baseUrl("http://localhost").build(), "test-key");

        Optional<GeocodedLocation> location = geocodingService.geocode("asdkjasdlkj123");

        assertTrue(location.isEmpty());
    }

    @Test
    void shouldReturnEmptyWhenAddressResolvesOnlyToPostcodeLevel() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "formatted": "74629 Pfedelbach, Germany",
                "lat": 49.1534,
                "lon": 9.5341,
                "result_type": "postcode"
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder.baseUrl("http://localhost").build(), "test-key");

        Optional<GeocodedLocation> location = geocodingService.geocode("74629 Pfedelbach, Germany");

        assertTrue(location.isEmpty());
    }

    @Test
    void shouldReturnEmptyWhenAddressResolvesOnlyToCityLevel() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "formatted": "Pfedelbach, Germany",
                "lat": 49.1534,
                "lon": 9.5341,
                "result_type": "city"
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder.baseUrl("http://localhost").build(), "test-key");

        Optional<GeocodedLocation> location = geocodingService.geocode("Pfedelbach");

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
                "lon": 13.4132147,
                "result_type": "amenity"
              }
            },
            {
              "properties": {
                "formatted": "Alexanderstraße, 10178 Berlin, Germany",
                "lat": 52.5210,
                "lon": 13.4140,
                "result_type": "street"
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder.baseUrl("http://localhost").build(), "test-key");

        List<AddressSuggestion> suggestions = geocodingService.autocomplete("Alexander");

        assertEquals(2, suggestions.size());
        assertEquals("Alexanderplatz, 10178 Berlin, Germany", suggestions.get(0).formattedAddress());
        assertEquals(52.5219814, suggestions.get(0).lat());
    }

    @Test
    void shouldFilterOutVagueAutocompleteSuggestions() {
        RestClient.Builder builder = RestClient.builder();

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        String responseBody = """
        {
          "features": [
            {
              "properties": {
                "formatted": "Gartenstraße, 74629 Pfedelbach, Germany",
                "lat": 49.1763,
                "lon": 9.5064,
                "result_type": "street"
              }
            },
            {
              "properties": {
                "formatted": "74629 Pfedelbach, Germany",
                "lat": 49.1534,
                "lon": 9.5341,
                "result_type": "postcode"
              }
            }
          ]
        }
        """;

        server.expect(request -> {})
                .andRespond(withSuccess(responseBody, MediaType.APPLICATION_JSON));

        GeocodingService geocodingService = new GeocodingService(builder.baseUrl("http://localhost").build(), "test-key");

        List<AddressSuggestion> suggestions = geocodingService.autocomplete("Pfedelbach");

        assertEquals(1, suggestions.size());
        assertEquals("Gartenstraße, 74629 Pfedelbach, Germany", suggestions.getFirst().formattedAddress());
    }
}
