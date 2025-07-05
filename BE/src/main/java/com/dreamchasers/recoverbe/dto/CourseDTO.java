package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.entity.CourseKit.Progress;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class CourseDTO {
    private UUID id;
    private int discount;
    private int price;
    private int totalDuration;
    private int isEditedCategories;
    private int isEdited;
    private int totalRegister;
    private int totalRating;
    private double scoreRating;
    private UserBasicDTO author;
    private String title;
    private String tier;
    private String description;
    private String thumbnail;
    private String video;
    private boolean enrolled;
    private boolean visible;
    private CoursePostStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> categories;
    private List<SectionDTO> sections;
    private Progress progress;
}
