package com.dreamchasers.recoverbe.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class CommentDTOInCourse extends CommentDTO{
    private UUID lessonId;
    private UUID courseId;
    private String title;
    private boolean isFollowed;
}
