package com.example.ltw2_project.controller;

import com.example.ltw2_project.dto.*;
import com.example.ltw2_project.model.Role;
import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.UserRepository;
import com.example.ltw2_project.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwt) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    // ✅ Đăng ký user mới
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email đã tồn tại"));
        }

        User u = new User(
                req.getEmail(),
                req.getFullName(),
                req.getPhone(),
                encoder.encode(req.getPassword()),
                Role.USER,
                true,
                Instant.now()
        );
        userRepo.save(u);

        String token = jwt.generateToken(u.getEmail(), Map.of("role", u.getRole().name()));
        return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), u.getRole(), u.getFullName()));
    }

    // ✅ Đăng nhập user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req) {
        try {
            User u = userRepo.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

            if (!u.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."));
            }

            if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Sai email hoặc mật khẩu"));
            }

            String token = jwt.generateToken(u.getEmail(), Map.of("role", u.getRole().name()));
            return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), u.getRole(), u.getFullName()));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đăng nhập thất bại: " + ex.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Thiếu token"));
            }

            String token = authHeader.substring(7);
            String email = jwt.getSubject(token);

            User u = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // ⚠️ Nếu tài khoản bị khóa
            if (!u.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Tài khoản của bạn đã bị khóa"));
            }

            return ResponseEntity.ok(Map.of(
                    "email", u.getEmail(),
                    "fullName", u.getFullName(),
                    "role", u.getRole(),
                    "active", u.isActive()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token không hợp lệ hoặc đã hết hạn"));
        }
    }

}
