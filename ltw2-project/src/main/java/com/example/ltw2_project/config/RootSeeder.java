package com.example.ltw2_project.config;

import com.example.ltw2_project.model.Role;
import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class RootSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Value("${ROOT_EMAIL:root@ltw2.local}")
    private String rootEmail;

    @Value("${ROOT_PASSWORD:root123}")
    private String rootPassword;

    public RootSeeder(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepo.existsByEmail(rootEmail)) {
            User root = new User();
            root.setEmail(rootEmail);
            root.setFullName("Root User");
            root.setPasswordHash(encoder.encode(rootPassword));
            root.setRole(Role.ROOT);
            root.setActive(true);
            root.setCreatedAt(Instant.now());
            userRepo.save(root);
            System.out.println("===> Seeded ROOT: " + rootEmail);
        }
    }
}
