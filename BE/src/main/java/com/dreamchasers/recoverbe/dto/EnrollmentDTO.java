package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class EnrollmentDTO {
    private boolean isCompleted;
    private int totalLessons;
    private int totalCompletedLessons;
    private CourseDTO course;
    private List<ProgressDTO> progresses;
    private RatingDTO myRating;
}
