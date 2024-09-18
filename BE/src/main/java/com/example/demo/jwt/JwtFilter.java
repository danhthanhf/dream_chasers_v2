package com.example.demo.jwt;

import com.example.demo.dto.ResponseObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.Filter;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.EOFException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        if(request.getServletPath().contains("/api/v1/public")) {
            filterChain.doFilter(request, response);
            return;
        }

       try {
           String authHeader = request.getHeader("Authorization");
           String jwt;
           String email;
           if(authHeader == null || !authHeader.startsWith("Bearer ")) {
               filterChain.doFilter(request, response);
               return;
           }

           jwt = authHeader.substring(7);
           email = jwtService.extractUserName(jwt);
           if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
               UserDetails userDetails = userDetailsService.loadUserByUsername(email);
               if(jwtService.isValidToken(jwt, userDetails)) {
                   UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                   usernamePasswordAuthenticationToken.setDetails(
                           new WebAuthenticationDetailsSource().buildDetails(request)
                   );
                   SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
               }
           }
           filterChain.doFilter(request, response);
       }
       catch (MalformedJwtException | SignatureException e) {
           logger.error("Token is not valid: " + e.getMessage());
           response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           ResponseObject res = ResponseObject.builder().status(HttpStatus.UNAUTHORIZED).mess("Token is not valid, Log in again").build();
           ObjectMapper mapper = new ObjectMapper();
           response.getWriter().write(mapper.writeValueAsString(res));
       }
       catch (ExpiredJwtException e) {
           logger.error("Token is expiration: " + e.getMessage());
           response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           ResponseObject res = ResponseObject.builder().status(HttpStatus.UNAUTHORIZED).mess("Token is expiration, Log in again").build();
           ObjectMapper mapper = new ObjectMapper();
           response.getWriter().write(mapper.writeValueAsString(res));
       }
    }
}
