package com.example.demo.dto;

import com.example.demo.entity.data.Course;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ProgressDTO {
    private  Course course;
    private List<Integer> lessonIds = new ArrayList<>();
    public ProgressDTO(Course course) {
        this.course = course;
    }

    public ProgressDTO(Course course, List<Integer> lessonIds) {
        this.course = course;
        this.lessonIds = lessonIds;
    }
}
