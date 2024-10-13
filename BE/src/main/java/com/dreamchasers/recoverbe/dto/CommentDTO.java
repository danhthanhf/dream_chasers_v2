package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Deque;
import java.util.List;
import java.util.UUID;

@Builder
@Data
public class CommentDTO {
    private UUID id;
    private String content;
    private LocalDateTime createdAt;
    private String path;
    private UUID parentId;
    private UserBasicDTO author;
    private UserBasicDTO repliedUser;
    private int totalReplies;
    private Deque<CommentDTO> replies;
}
