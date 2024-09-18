package com.example.demo.handler;

import com.example.demo.jwt.JwtService;
import com.example.demo.jwt.Token;
import com.example.demo.repository.TokenRepository;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Data
@RequiredArgsConstructor
@Component
public class LogoutHandler implements org.springframework.security.web.authentication.logout.LogoutHandler {
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String jwt= request.getHeader("Authorization");
        if(jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
            Token token = tokenRepository.findByToken(jwt).orElse(null);
            if(token != null) {
                String email = jwtService.extractUserName(token.getToken());
                var user = userRepository.findByEmail(email).orElse(null);
                if(user != null) {
                    user.setToken(null);
                    SecurityContextHolder.clearContext();
                    tokenRepository.delete(token);
                    return;
                }
            }
        }
        SecurityContextHolder.clearContext();
    }
}
