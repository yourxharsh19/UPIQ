package com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Controller;

import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.DTO.UserDTO;
import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Model.User;
import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Helper method to convert User to UserDTO
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    // 🔹 Get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    // 🔹 Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> userOpt = userService.getUserByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(convertToDTO(userOpt.get()));
        }
        return ResponseEntity.badRequest().body("User not found with email: " + email);
    }

    // 🔹 Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(convertToDTO(userOpt.get()));
        }
        return ResponseEntity.badRequest().body("User not found with username: " + username);
    }

    // 🔹 Get current user (requires authentication)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        String email = authentication.getName();
        Optional<User> userOpt = userService.getUserByEmail(email);
        
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(convertToDTO(userOpt.get()));
        }
        
        return ResponseEntity.status(404).body("User not found");
    }
}
