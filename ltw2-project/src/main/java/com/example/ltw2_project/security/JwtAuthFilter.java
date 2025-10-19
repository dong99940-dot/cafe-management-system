package com.example.ltw2_project.security;

import com.example.ltw2_project.service.CustomUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.io.IOException;

@Component
public class JwtAuthFilter extends GenericFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String header = req.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String email = jwtUtil.getSubject(token);
                var userDetails = userDetailsService.loadUserByUsername(email);

                if (!userDetails.isEnabled()) {
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Tài khoản đã bị khóa");
                    return;
                }

                var auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (ExpiredJwtException ex) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token đã hết hạn. Vui lòng đăng nhập lại.");
                return;
            } catch (Exception ex) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ.");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
