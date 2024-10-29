package com.employeeproject.springbootbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.employeeproject.springbootbackend.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;

    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors() // Enable CORS with Security
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/login").permitAll() // Allow all users to access the login endpoint
                .requestMatchers("/api/employees/me").authenticated() // Allow access to authenticated users
                .requestMatchers("/api/employees/**").hasRole("ADMIN") // Restrict other employee endpoints to ADMIN
                .requestMatchers("/api/employees/test-cors").permitAll() // Allow access to the test CORS endpoint
                .requestMatchers("/admin-dashboard").permitAll() // Allow access to the admin dashboard without authentication
                .anyRequest().authenticated() // Require authentication for any other request
            )
            .httpBasic(); // Keep basic authentication if needed
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userService
                .findByEmail(username)
                .map(user -> new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    user.getAuthorities()
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
