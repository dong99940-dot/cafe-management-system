package com.example.ltw2_project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetPasswordEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String html = """
                <div style="font-family:Arial,sans-serif;padding:20px;background:#f9f9f9;border-radius:8px;">
                  <h2 style="color:#007bff;">🔒 Yêu cầu đặt lại mật khẩu</h2>
                  <p>Xin chào,</p>
                  <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. 
                  Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
                  <p style="text-align:center;">
                    <a href="%s" 
                       style="display:inline-block;padding:10px 20px;
                              background:#28a745;color:white;text-decoration:none;
                              border-radius:5px;font-weight:bold;">
                       Đặt lại mật khẩu
                    </a>
                  </p>
                  <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
                  <hr>
                  <p style="font-size:12px;color:#666;">Liên hệ quản trị viên nếu gặp sự cố.</p>
                </div>
            """.formatted(resetLink);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("🔑 Đặt lại mật khẩu - LTW2 Project");
            helper.setText(html, true);

            mailSender.send(message);
            System.out.println("📨 Đã gửi email đặt lại mật khẩu đến " + to);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}
