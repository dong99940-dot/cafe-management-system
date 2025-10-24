package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.Role;
import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/root")
public class AdminUserController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AdminUserController(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public static class CreateAdminReq {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;

        private String fullName;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
    }

    @PostMapping("/admins")
    @PreAuthorize("hasRole('ROOT')")
    public User createAdmin(@RequestBody CreateAdminReq req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User admin = new User();
        admin.setEmail(req.getEmail());
        admin.setFullName(req.getFullName());
        admin.setPasswordHash(encoder.encode(req.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setActive(true);
        admin.setCreatedAt(Instant.now());

        return userRepo.save(admin);
    }
}
