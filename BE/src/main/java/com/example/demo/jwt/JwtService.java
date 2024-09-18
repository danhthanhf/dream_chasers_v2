package com.example.demo.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@Data
@NoArgsConstructor
public class JwtService {
    private String SECRET_KEY = getSecretKey();

    @Value("${jwt-expiration}")
    private long expiration;
    private long refreshToken;

    public String buildToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .subject(userDetails.getUsername())
                .signWith(getKey())
                .issuedAt(new Date())
                .compact();
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractClaimsFromToken(token);
//        if (claims != null) {
            return claimsResolver.apply(claims);
//        }
//        return null;
    }


    public String extractUserName(String token) {
//        return extractClaims(token, new Function<Claims, String> () {
//            @Override
//            public String apply(Claims claims) {
//                return claims.getSubject();
//            }
//        });
//        return extractClaims(token, claims -> claims.getSubject());
        return extractClaims(token, Claims::getSubject);

    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    public Boolean isValidToken(String token, UserDetails userDetails) {
        String username = extractUserName(token);
        return !isTokenExpired(token) && username.equals(userDetails.getUsername());
    }


    private Claims extractClaimsFromToken(String token) {
//       try {
           return Jwts.parser()
                   .verifyWith((SecretKey) getKey())
                   .build().parseSignedClaims(token).getPayload();
//       }
//       catch (Exception e) {
//           System.out.println("extractClaimsFromToken: " + e.getMessage());
//           return null;
//       }
    }


    public String generateToken(UserDetails userDetails )  {
        return buildToken(new HashMap<>(), userDetails);
    }

    public Key getKey() {
        byte[] key = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(key);
    }


    private String getSecretKey() {
        SecureRandom random = new SecureRandom(); // hàm random có tính bảo mật cao
        byte[] key = new byte[32];
        random.nextBytes(key); // random ra chuỗi 32byte
        return Base64.getEncoder().encodeToString(key); // encode chuỗi 32 byte sang chuỗi sử dụng base64
    }
}
