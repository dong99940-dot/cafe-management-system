package com.example.ltw2_project.service;

import com.example.ltw2_project.model.User;
import com.example.ltw2_project.repository.UserRepository;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    public CustomUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!u.isActive()) {
            throw new DisabledException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPasswordHash(),
                u.isActive(), 
                true,          // tài khoản chưa hết hạn (accountNonExpired)
                true,          // thông tin xác thực chưa hết hạn (credentialsNonExpired)
                true,          // tài khoản không bị khóa (accountNonLocked)
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()))
        );
    }
}
