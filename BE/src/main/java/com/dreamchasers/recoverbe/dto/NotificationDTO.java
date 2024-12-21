package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.NotificationType;
import com.dreamchasers.recoverbe.enums.ReferenceType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;
@Builder
@Data
public class NotificationDTO {
    private UUID id;
    private String content;
    private String postTitle;
    private String title;
    private NotificationType type;
    private UserBasicDTO author;
    private UserBasicDTO sender;
    private UUID commentId;
    private UUID lessonId;
    private UUID courseId;
    private ReferenceType referenceType;
    private LocalDateTime createdAt;
    private boolean isRead;

}
