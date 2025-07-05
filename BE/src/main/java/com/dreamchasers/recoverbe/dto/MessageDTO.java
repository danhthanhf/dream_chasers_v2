package com.dreamchasers.recoverbe.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private UUID chatId;
    private UUID id;
    private String content;
    private String img;
    private UserBasicDTO sender;
    private LocalDateTime createdAt;
}
