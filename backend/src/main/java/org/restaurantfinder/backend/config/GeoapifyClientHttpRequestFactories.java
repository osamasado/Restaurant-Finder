package org.restaurantfinder.backend.config;

import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.HttpClientSettings;
import org.springframework.http.client.ClientHttpRequestFactory;

import java.time.Duration;

// Shared by every service that talks to Geoapify, since none of them had any connect/read
// timeout - a slow/unresponsive response could hang a request thread indefinitely. Each
// caller picks its own budget (autocomplete is on the per-keystroke path and needs a tight
// one; multi-call search flows need more room).
public final class GeoapifyClientHttpRequestFactories {

    private GeoapifyClientHttpRequestFactories() {
    }

    public static ClientHttpRequestFactory withTimeouts(Duration connectTimeout, Duration readTimeout) {
        return ClientHttpRequestFactoryBuilder.detect()
                .build(HttpClientSettings.defaults().withTimeouts(connectTimeout, readTimeout));
    }
}
