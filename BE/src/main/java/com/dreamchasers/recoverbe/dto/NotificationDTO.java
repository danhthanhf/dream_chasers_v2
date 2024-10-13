package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.model.Notification;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
public class NotificationDTO {
    private List<Notification> notifications;
    private long totalElements;
    private int totalUnread;
}
