package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.context.annotation.Bean;

@Data
@Builder
public class CommentDTO {
    private String email;
    private String userName;
    private String content;
    private String path;
    private int lessonId;
    private int postId;
    private boolean sub;
    private String avatar;
    private int parentId;
    private String replyToUser;
    private String replyToUserName;
}
