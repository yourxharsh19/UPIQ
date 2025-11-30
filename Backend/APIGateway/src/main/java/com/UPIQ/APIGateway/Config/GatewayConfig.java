package com.UPIQ.APIGateway.Config;

import com.UPIQ.APIGateway.Filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public GatewayConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Public Authentication Routes (no JWT filter)
                .route("user-auth-public", r -> r
                        .path("/api/v1/auth/**")
                        .uri("lb://UPIQ-User-Authentication-Service")
                )
                
                // Protected User Service Routes (with JWT filter)
                .route("user-service", r -> r
                        .path("/api/v1/users/**")
                        .filters(f -> f.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://UPIQ-User-Authentication-Service")
                )
                
                // Health Check Routes (no JWT filter)
                .route("health-check", r -> r
                        .path("/health/**")
                        .uri("lb://UPIQ-User-Authentication-Service")
                )
                
                // PDF Parser Service Routes (with JWT filter)
                .route("pdf-parser-service", r -> r
                        .path("/api/parser/**")
                        .filters(f -> f.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://UPIQ-PDFParser-Service")
                )
                
                // Transaction Service Routes (with JWT filter)
                .route("transaction-service", r -> r
                        .path("/api/transactions/**")
                        .filters(f -> f.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://UPIQ-Transaction-Service")
                )
                
                // Category Service Routes (with JWT filter)
                .route("category-service", r -> r
                        .path("/api/categories/**")
                        .filters(f -> f.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://UPIQ-Category-Service")
                )
                
                .build();
    }
}

