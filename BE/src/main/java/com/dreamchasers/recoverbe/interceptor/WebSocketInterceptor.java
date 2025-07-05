package com.dreamchasers.recoverbe.interceptor;

import com.dreamchasers.recoverbe.enums.UserStatus;
import com.dreamchasers.recoverbe.jwt.JwtService;
import com.dreamchasers.recoverbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class WebSocketInterceptor implements HandshakeInterceptor {
    private final JwtService jwtService;
    private final UserService userService;

    private String getTokenFromURI(String uri) {
        String token = uri.substring("token=".length());
        if(token.indexOf("&") != -1) {
            token = token.substring(0, token.indexOf("&"));
        }
        return token;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String query = servletRequest.getURI().getQuery();
            if (query != null && query.startsWith("token=")) {
                String token = getTokenFromURI(query);
                String username = jwtService.extractUserName(token);
                System.out.println("========User " + username + " Connected==========");
                var user = userService.findByEmail(username);
                userService.updateStatus(username, UserStatus.ONLINE);
                attributes.put("user", user);
            }
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}
