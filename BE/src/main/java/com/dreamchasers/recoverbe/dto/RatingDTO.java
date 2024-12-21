package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class RatingDTO {
    private double rating;
    private String fullName;
    private LocalDateTime createdAt;
    private String comment;
    private String avatarUrl;
}
