package com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Service;

import com.SmartSpend.User_Authentication_Service.UserAuthenticationService.Model.User;
import java.util.Optional;
import java.util.List;

    public interface UserService {
        User saveUser(User user);
        Optional<User> getUserByEmail(String email);
        Optional<User> getUserByUsername(String username);
        List<User> getAllUsers();

    }

