package com.dreamchasers.recoverbe.handler;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.UserStatus;
import com.dreamchasers.recoverbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class WebsocketEventListener {
    private final UserService userService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null && sessionAttributes.containsKey("user")) {
            User user = (User) sessionAttributes.get("user");
            System.out.println("========User " + user.getEmail() + " disconnected==========");

            userService.updateStatus(user.getEmail(), UserStatus.OFFLINE);
            sessionAttributes.remove("user");
        }
    }

}
