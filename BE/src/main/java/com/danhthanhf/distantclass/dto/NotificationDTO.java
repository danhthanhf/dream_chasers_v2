package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.common.enums.NotificationType;
import com.danhthanhf.distantclass.common.enums.ReferenceType;
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
