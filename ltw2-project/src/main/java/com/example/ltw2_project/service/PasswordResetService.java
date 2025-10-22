package com.example.ltw2_project.service;

import com.example.ltw2_project.model.PasswordResetToken;
import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.PasswordResetTokenRepository;
import com.example.ltw2_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final Duration tokenLifetime;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService,
                                @Value("${app.reset.token-expiration-minutes:30}") long tokenExpirationMinutes) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenLifetime = Duration.ofMinutes(tokenExpirationMinutes);
    }

    public void initiatePasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();
        tokenRepository.deleteByUserId(user.getId());

        String tokenValue = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiresAt = now.plus(tokenLifetime);

        PasswordResetToken resetToken = new PasswordResetToken(user.getId(), tokenValue, now, expiresAt, false);
        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user, tokenValue);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token đặt lại mật khẩu không hợp lệ"));

        if (resetToken.isConsumed()) {
            throw new IllegalArgumentException("Token đặt lại mật khẩu đã được sử dụng");
        }

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            tokenRepository.deleteById(resetToken.getId());
            throw new IllegalArgumentException("Token đặt lại mật khẩu đã hết hạn");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng cho token"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setConsumed(true);
        tokenRepository.save(resetToken);
    }
}
