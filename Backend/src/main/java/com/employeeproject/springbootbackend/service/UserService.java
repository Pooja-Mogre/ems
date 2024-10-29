package com.employeeproject.springbootbackend.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.employeeproject.springbootbackend.model.User;
import com.employeeproject.springbootbackend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean validateUserPassword(String rawPassword, String email) {
        Optional<User> userOpt = findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }

    public void validateUserEmail(String email) {
        if (!userRepository.findByEmail(email).isPresent()) {
            throw new EntityNotFoundException("User not found with email: " + email);
        }
    }
}