package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.entity.User.User;
import lombok.Builder;

import java.util.UUID;

@Builder
public class NotificationDTO {
    private UUID id;
    private String content;
    private boolean isRead;
    private UserBasicDTO author;
    private UserBasicDTO sender;
    private Object reference;

}
