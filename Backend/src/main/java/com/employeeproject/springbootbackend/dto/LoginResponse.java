package com.employeeproject.springbootbackend.dto;

import com.employeeproject.springbootbackend.model.Role;

public class LoginResponse {
    private String role; // or Role role if you prefer enum

    // Constructor accepting Role enum
    public LoginResponse(Role role) {
        this.role = role.name(); // Convert Role to String, if that's what you need
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}