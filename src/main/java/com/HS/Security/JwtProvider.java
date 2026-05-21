package com.HS.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;

@Service
public class JwtProvider {

    private final SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY_STRING.getBytes());

    public String generateToken(Authentication auth) {

        String email = auth.getName();
        if (email == null && auth.getPrincipal() != null) {
            Object p = auth.getPrincipal();
            if (p instanceof org.springframework.security.core.userdetails.UserDetails) {
                email = ((org.springframework.security.core.userdetails.UserDetails) p).getUsername();
            } else {
                email = p.toString();
            }
        }

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .claim("email", email)
                .claim("authorities", populateAuthorities(auth.getAuthorities()))
                .signWith(key)
                .compact();
    }

    public String getEmailFromJwtToken(String jwt) {

        if (jwt == null) return null;

        try {

            if (jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.get("email", String.class);

        } catch (Exception e) {
            System.out.println("Invalid JWT: " + e.getMessage());
            return null;
        }
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> set = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            set.add(authority.getAuthority());
        }
        return String.join(",", set);
    }
}
