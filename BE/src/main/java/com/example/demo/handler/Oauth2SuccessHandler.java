package com.example.demo.handler;

import com.example.demo.auth.AuthService;
import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.jwt.JwtService;
import com.example.demo.jwt.Token;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Data
@Component
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final CloudService cloudService;
    private final AuthService authService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String avatar = "";
        if (oauth2User.getAttribute("picture") != null) {
            avatar = Objects.requireNonNull(oauth2User.getAttribute("picture")).toString();
        }
        String email = "";
        if(oauth2User.getAttribute("email") != null) {
            email = oauth2User.getAttribute("email");
        }
        String family_name = "";
        if(oauth2User.getAttribute("name") != null) {
            family_name = oauth2User.getAttribute("name").toString();
        }
        if(oauth2User.getAttribute("login") != null && Objects.equals(email, "")) {
            email = oauth2User.getAttribute("login");
        }
        var user = authService.findUserByEmail(email);
        if(user == null) {
            user = User.builder()
                    .email(Objects.equals(email, "") ? null : email)
                    .lastName(family_name)
                    .role(Role.USER)
                    .avatar(Objects.equals(avatar, "") ? null : avatar)
                    .build();
        }
        String userAvatar = user.getAvatar();
        if(userAvatar == null && !Objects.equals(avatar, "")) {
            user.setAvatar(avatar);
        }

        if(userAvatar != null && Objects.equals(avatar, "")) {
            avatar = user.getAvatar();
        }

        userRepository.save(user);
        Token token = new Token(jwtService.generateToken(user));
        user.setToken(token);

        String redirectUrl = "http://localhost:3000/?token=" + URLEncoder.encode(token.getToken(), StandardCharsets.UTF_8)
                + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                + "&lastName=" + URLEncoder.encode(family_name, StandardCharsets.UTF_8)
                + "&avatar=" + URLEncoder.encode(avatar, StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);
    }
}
