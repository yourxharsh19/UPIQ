package com.UPIQ.UserAuthenticationService.service;

import com.UPIQ.UserAuthenticationService.model.User;
import java.util.Optional;
import java.util.List;

public interface UserService {
    User saveUser(User user);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserByUsername(String username);
    List<User> getAllUsers();
}

