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

    // ✅ Lấy tất cả người dùng
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public List<User> getAll() {
        return userRepo.findAll();
    }

    // ✅ Cập nhật vai trò người dùng
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public User updateRole(@PathVariable String id, @RequestParam Role role) {
        // Spring tự động convert String -> Role
        User u = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        u.setRole(role);
        return userRepo.save(u);
    }

    // ✅ Khóa hoặc mở tài khoản
    @PutMapping("/{id}/active")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public User setActive(@PathVariable String id, @RequestParam boolean active) {
        User u = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        u.setActive(active);
        return userRepo.save(u);
    }
}
