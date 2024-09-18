package com.example.demo.dto;


import com.example.demo.entity.data.PostStatus;
import com.example.demo.entity.data.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private int id;
    private String content;
    private String title;
    private LocalDateTime createAt;
    private List<Tag> tags;
    private String thumbnail;
    private final int totalComment;
    private String email;
    private String userAvatar;
    private String userName;
    private PostStatus status;
    private boolean isFavorite = false;
}
