package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.PasswordResetToken;
import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.PasswordResetTokenRepository;
import com.example.ltw2_project.repository.UserRepository;
import com.example.ltw2_project.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder encoder;
    private final EmailService emailService;

    @Value("${app.frontend.base-url}")
    private String baseUrl;

    public PasswordResetController(UserRepository userRepo,
                                   PasswordResetTokenRepository tokenRepo,
                                   PasswordEncoder encoder,
                                   EmailService emailService) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Không tìm thấy tài khoản với email này");
        }

        tokenRepo.deleteByEmail(email);
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(email, token, Instant.now().plus(30, ChronoUnit.MINUTES));
        tokenRepo.save(resetToken);

        String resetLink = baseUrl + "/reset-password?token=" + token;
        emailService.sendResetPasswordEmail(email, resetLink);

        return Map.of("message", "Link đặt lại mật khẩu đã được gửi đến email của bạn");
    }

    @GetMapping("/validate-reset-token")
    public Map<String, Object> validateToken(@RequestParam String token) {
        PasswordResetToken resetToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));
        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }
        return Map.of("valid", true, "email", resetToken.getEmail());
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> req) {
        String token = req.get("token");
        String newPassword = req.get("password");

        PasswordResetToken resetToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }

        User user = userRepo.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        user.setPasswordHash(encoder.encode(newPassword));
        userRepo.save(user);

        tokenRepo.delete(resetToken);
        return Map.of("message", "Đặt lại mật khẩu thành công!");
    }
}
