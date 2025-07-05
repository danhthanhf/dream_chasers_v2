package com.danhthanhf.distantclass.dto;

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
