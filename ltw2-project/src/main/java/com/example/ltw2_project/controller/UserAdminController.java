package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.Role;
import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAdminController {

    private final UserRepository userRepo;

    public UserAdminController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public List<User> getAll() {
        return userRepo.findAll();
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public User updateRole(@PathVariable String id, @RequestParam Role role) {
        User u = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        u.setRole(role);
        return userRepo.save(u);
    }

    @PutMapping("/{id}/active")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public User setActive(@PathVariable String id, @RequestParam boolean active) {
        User u = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        u.setActive(active);
        return userRepo.save(u);
    }
}
