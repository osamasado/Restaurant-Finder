package org.restaurantfinder.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${default.success.uri}")
    private String successUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/oauth2/**", "/login/**", "/logout").permitAll()
                        .requestMatchers("/api/auth").authenticated()
                        .requestMatchers("/api/favorites").authenticated()
                        .requestMatchers("/api/restaurants").permitAll()
                        .requestMatchers("/api/routes").permitAll()
                        .requestMatchers("/api/restaurants/*").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                PathPatternRequestMatcher.pathPattern("/api/**")
                        )
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl(successUri, true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl(successUri)
                );

        return http.build();
    }

}
