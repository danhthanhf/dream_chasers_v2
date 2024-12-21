package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.entity.User.Notification;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListNotificationDTO {
    private List<NotificationDTO> notifications;
    private long totalCurrentElements;
    private long totalUnread;
    private long totalAllElements;
}
