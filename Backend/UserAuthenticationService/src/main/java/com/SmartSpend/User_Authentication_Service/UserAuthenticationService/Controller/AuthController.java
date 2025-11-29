package com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Controller;

import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.DTO.LoginRequest;
import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.DTO.RegisterRequest;
import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 🧾 Register new user
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        String result = authService.registerUser(request);
        
        if (result.equals("User registered successfully!")) {
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        
        response.put("success", false);
        response.put("message", result);
        return ResponseEntity.badRequest().body(response);
    }

    // 🔑 Login existing user
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        String result = authService.loginUser(request);
        
        // If result is a JWT token (starts with "ey"), it's a successful login
        if (result != null && result.startsWith("ey")) {
            response.put("success", true);
            response.put("message", "Login successful!");
            response.put("token", result);
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", result);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}