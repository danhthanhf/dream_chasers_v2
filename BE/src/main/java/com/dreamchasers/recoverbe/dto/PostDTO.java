package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.model.Post.PostStatus;
import com.dreamchasers.recoverbe.model.Post.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor

public class PostDTO {
    private UUID id;
    private String content;
    private String title;
    private int totalPageComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Tag> tags;
    private String thumbnail;
    private String description;
    private final int totalComment;
    private String email;
    private String userAvatar;
    private String userName;
    private PostStatus status;
    private int views;
    private boolean liked = false;
    private int likes;
    private Deque<CommentDTO> comments;
    private boolean isFavorite = false;
}
