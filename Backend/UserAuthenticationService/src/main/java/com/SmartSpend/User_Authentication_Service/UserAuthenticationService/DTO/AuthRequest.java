package com.SmartSpend.User_Authentication_Service.UserAuthenticationService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthRequest {
    private String token;
    private String email;
    private String role;
}
