package com.UPIQ.APIGateway.Filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${USER_AUTH_SERVICE_URL}")  // ✅ Use environment variable from Docker Compose
    private String userAuthServiceUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        super(Config.class);
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            log.info("Incoming request: {} {}", request.getMethod(), request.getURI().getPath());

            if (isPublicEndpoint(request.getURI().getPath())) {
                log.info("Public endpoint – skipping JWT validation");
                return chain.filter(exchange);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid or missing token", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

                JwtParser parser = Jwts.parser()
                        .verifyWith(key)
                        .build();

                Jws<Claims> jws = parser.parseSignedClaims(token);
                Claims claims = jws.getPayload();

                String email = claims.getSubject();
                String userIdFromToken = claims.get("userId", String.class);

                if (userIdFromToken != null && !userIdFromToken.isEmpty()) {
                    return processWithUserId(exchange, email, userIdFromToken, chain);
                }

                // Fetch userId dynamically from User Auth Service
                return fetchUserIdByEmail(email)
                        .flatMap(userId -> processWithUserId(exchange, email, userId, chain))
                        .onErrorResume(e -> {
                            log.warn("Error fetching userId for {}: {}", email, e.getMessage());
                            return processWithUserId(exchange, email, null, chain);
                        });

            } catch (Exception e) {
                log.error("JWT validation failed", e);
                return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<String> fetchUserIdByEmail(String email) {
        return webClient.get()
                .uri(userAuthServiceUrl + "/api/v1/users/email/" + email)  // ✅ Ensure v1
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> json.get("userId").asText());
    }

    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/v1/auth/login")
                || path.startsWith("/api/v1/auth/register")
                || path.startsWith("/actuator")
                || path.startsWith("/api/v1/public");
    }

    private Mono<Void> processWithUserId(ServerWebExchange exchange, String email,
                                         String userId, GatewayFilterChain chain) {

        ServerHttpRequest.Builder requestBuilder = exchange.getRequest().mutate();

        if (email != null)
            requestBuilder.header("X-User-Email", email);

        if (userId != null)
            requestBuilder.header("X-User-Id", userId);  // ✅ Required for TransactionController

        return chain.filter(exchange.mutate().request(requestBuilder.build()).build());
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);

        byte[] bytes = ("{\"success\":false,\"message\":\"" + message + "\"}")
                .getBytes(StandardCharsets.UTF_8);

        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }

    public static class Config {}
}
