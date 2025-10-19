package com.example.ltw2_project.dto;

import com.example.ltw2_project.model.Role;

public class AuthResponse {
    private String token;
    private String email;
    private Role role;
    private String fullName;

    public AuthResponse(String token, String email, Role role, String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
    }

    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
