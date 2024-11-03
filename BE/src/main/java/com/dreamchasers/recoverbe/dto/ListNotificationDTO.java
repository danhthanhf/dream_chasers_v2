package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.entity.Notification;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListNotificationDTO {
    private List<Notification> notifications;
    private long totalElements;
    private int totalUnread;
}
