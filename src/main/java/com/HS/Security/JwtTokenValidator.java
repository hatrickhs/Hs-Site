package com.HS.Security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;



public class JwtTokenValidator extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                              HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("Request URI: " + request.getRequestURI());
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }
        String path = request.getRequestURI();
//        if (path.startsWith("/auth")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
        if (path.startsWith("/auth")
                || (path.startsWith("/sellers") && request.getMethod().equals("POST"))) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = request.getHeader(JWT_CONSTANT.JWT_HEADER);

        if (jwt != null && jwt.startsWith("Bearer ")) {
            try { SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));
                jwt = jwt.substring(7);

                Claims claims = Jwts.parserBuilder() .setSigningKey(key) .build() .parseClaimsJws(jwt) .getBody();

                System.out.println("Claims in JWT: " + claims);

                String email = claims.get("email") != null ? claims.get("email").toString() : claims.getSubject();
                String authorities = String.valueOf(claims.get("authorities"));
                if ("null".equals(authorities)) authorities = "";
                List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("EMAIL FROM JWT = " + email);
                System.out.println("AUTHORITIES FROM JWT = " + authorities);
                System.out.println("JWT EMAIL READ = " + claims.get("email"));

            }

            catch (Exception e) {
                throw new BadCredentialsException("Invalid JWT token...");
            }

        }

        filterChain.doFilter(request, response);

    }
}