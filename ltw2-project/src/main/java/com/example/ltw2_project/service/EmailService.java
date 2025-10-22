package com.example.ltw2_project.service;

import com.example.ltw2_project.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String resetBaseUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.from:no-reply@cafe.local}") String fromAddress,
                        @Value("${app.reset.base-url:http://localhost:3000/reset-password}") String resetBaseUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.resetBaseUrl = resetBaseUrl;
    }

    public void sendPasswordResetEmail(User user, String token) {
        String resetLink = UriComponentsBuilder.fromHttpUrl(resetBaseUrl)
                .queryParam("token", token)
                .build()
                .toUriString();

        StringBuilder content = new StringBuilder();
        content.append("Xin chào ").append(user.getFullName() != null ? user.getFullName() : user.getEmail()).append(",\n\n");
        content.append("Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. ");
        content.append("Vui lòng sử dụng liên kết dưới đây để đặt lại mật khẩu (liên kết có thời hạn).\n\n");
        content.append(resetLink).append("\n\n");
        content.append("Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.\n\n");
        content.append("Trân trọng,\nCafe Management System");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setFrom(fromAddress);
        message.setSubject("Đặt lại mật khẩu tài khoản");
        message.setText(content.toString());

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new IllegalStateException("Không thể gửi email đặt lại mật khẩu", ex);
        }
    }
}
