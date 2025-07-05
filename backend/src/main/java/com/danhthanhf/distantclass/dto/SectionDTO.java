package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.entity.CourseKit.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionDTO {
    private UUID id;
    private String title;
    private int totalDuration;
    private int isEdited;
    private List<Lesson> lessons;
}