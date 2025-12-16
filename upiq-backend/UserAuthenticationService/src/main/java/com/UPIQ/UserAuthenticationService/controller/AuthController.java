package com.UPIQ.UserAuthenticationService.controller;

import com.UPIQ.UserAuthenticationService.dto.ApiResponse;
import com.UPIQ.UserAuthenticationService.dto.LoginRequest;
import com.UPIQ.UserAuthenticationService.dto.RegisterRequest;
import com.UPIQ.UserAuthenticationService.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 🧾 Register new user
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerUser(@Valid @RequestBody RegisterRequest request) {
        String result = authService.registerUser(request);

        if (result.equals("User registered successfully!")) {
            Map<String, Object> data = new HashMap<>();
            data.put("message", result);
            ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                    .success(true)
                    .data(data)
                    .message("User registered successfully")
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .success(false)
                .data(null)
                .message(result)
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 🔑 Login existing user
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginUser(@Valid @RequestBody LoginRequest request) {
        String result = authService.loginUser(request);

        // If result is a JWT token (starts with "ey"), it's a successful login
        if (result != null && result.startsWith("ey")) {
            Map<String, Object> data = new HashMap<>();
            data.put("token", result);
            ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                    .success(true)
                    .data(data)
                    .message("Login successful")
                    .build();
            return ResponseEntity.ok(response);
        }

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .success(false)
                .data(null)
                .message(result)
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
