package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.entity.chat.Message;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ChatDTO {
    private UUID id;
    private UserBasicDTO recipient;
    private Page<Message> messages;
    private boolean isRead;
    private int totalUnreadMessage;
    private LocalDateTime lastMessageTime;
}
