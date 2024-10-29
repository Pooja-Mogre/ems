package com.employeeproject.springbootbackend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employeeproject.springbootbackend.dto.LoginRequest;
import com.employeeproject.springbootbackend.dto.LoginResponse;
import com.employeeproject.springbootbackend.model.User;
import com.employeeproject.springbootbackend.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class LoginController {

    private static final Logger log = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for: {}", loginRequest.getEmail());

        // Fetch user by email
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());
        if (user.isPresent()) {
            log.info("User found: {}", user.get().getEmail());

            // Log provided password and stored hashed password
            log.debug("Provided password: {}", loginRequest.getPassword());
            log.debug("Stored password: {}", user.get().getPassword());

            // Check if the provided password matches the stored hashed password
            if (passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
                log.info("Successful login for user: {}", user.get().getEmail());
                return ResponseEntity.ok(new LoginResponse(user.get().getRole())); // Send back user role
            } else {
                log.warn("Password mismatch for user: {}", user.get().getEmail());
            }
        } else {
            log.warn("No user found with email: {}", loginRequest.getEmail());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}