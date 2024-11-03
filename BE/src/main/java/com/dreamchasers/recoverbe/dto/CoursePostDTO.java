package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class CoursePostDTO {
    private List<PostDTO> posts;
    private List<CourseDTO> courses;
}
