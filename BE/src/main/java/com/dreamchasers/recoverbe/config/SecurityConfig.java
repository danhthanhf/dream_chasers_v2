package com.dreamchasers.recoverbe.config;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.jwt.JwtFilter;
import com.dreamchasers.recoverbe.entity.User.Role;
import com.dreamchasers.recoverbe.jwt.JwtService;
import com.dreamchasers.recoverbe.repository.UserRepository;
import com.dreamchasers.recoverbe.service.AuthService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    @Bean
    public AccessDeniedHandler accessDeniedHandler () {
        return (request, response, accessDeniedException) -> {
            response.getWriter().write("You dont have permission to access this resource");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        };
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authenticationEntryPointException) -> {
            response.getWriter().write("Please login to access this resource");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        };
    }

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedHeaders("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }

    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (request, response, authentication) -> {
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
                        .avatarUrl(Objects.equals(avatar, "") ? null : avatar)
                        .build();
            }
            String userAvatar = user.getAvatarUrl();
            if(userAvatar == null && !Objects.equals(avatar, "")) {
                user.setAvatarUrl(avatar);
            }

            if(userAvatar != null && Objects.equals(avatar, "")) {
                avatar = user.getAvatarUrl();
            }

            userRepository.save(user);
            String token = jwtService.generateAccessToken(user);
            user.setAccessToken(token);

            String redirectUrl = "http://localhost:3000/?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                    + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                    + "&lastName=" + URLEncoder.encode(family_name, StandardCharsets.UTF_8)
                    + "&avatarUrl=" + URLEncoder.encode(avatar, StandardCharsets.UTF_8);
            response.sendRedirect(redirectUrl);
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/me/**").hasAnyRole(Role.ADMIN.name(), Role.MANAGER.name(), Role.USER.name())
                        .requestMatchers("/api/v1/notifications/**").hasAnyRole(Role.ADMIN.name(), Role.MANAGER.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.GET, "/api/v1/private/**").hasAnyRole(Role.ADMIN.name(), Role.MANAGER.name())
                        .requestMatchers(HttpMethod.POST, "/api/v1/private/**").hasAnyRole(Role.ADMIN.name(), Role.MANAGER.name())
                        .requestMatchers(HttpMethod.PUT, "/api/v1/private/**").hasAnyRole(Role.ADMIN.name(), Role.MANAGER.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/private/**").hasAnyRole(Role.ADMIN.name())
                        .anyRequest().permitAll()
                )
                .exceptionHandling(e -> e
                        .accessDeniedHandler(accessDeniedHandler())
                        .authenticationEntryPoint(authenticationEntryPoint())
                )
                .oauth2Login(o -> o.successHandler(oauth2SuccessHandler()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @PostConstruct
    public void enableAuthCtxOnSpawnedThreads() {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }
}
