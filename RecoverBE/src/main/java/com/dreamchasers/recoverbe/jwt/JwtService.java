package com.dreamchasers.recoverbe.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.security.SecureRandom;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtService {
    private String secretKey = "";

    private long expiredAT = 60L * 60;
    private long expRT = 60L * 60 * 24 * 7;

    public JwtService() {
        this.secretKey = generateSecretKey();
    }

    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, expiredAT);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, expRT);
    }

    private String buildToken(Map<String, Object> claims, UserDetails userDetails, long expiredAT) {
        return Jwts.builder()
                .claims(claims)
                .expiration(new Date(System.currentTimeMillis() + expiredAT))
                .subject(userDetails.getUsername())
                .signWith(generateKey())
                .issuedAt(new Date(System.currentTimeMillis()))
                .compact();
    }

    public String extractUserName(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    public boolean isValidToken(String token, UserDetails userDetails) {
        String email = extractUserName(token);
        return isTokenExpired(token) && Objects.equals(email, userDetails.getUsername());
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith((SecretKey) generateKey()).build().parseSignedClaims(token).getPayload();
    }

    private Key generateKey() {
        System.out.println(secretKey + " - " + secretKey.length());
        byte[] key = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(key);
    }

    private String generateSecretKey() {
        SecureRandom random = new SecureRandom();
        byte[] key = new byte[32];
        random.nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }


}
