package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.model.CourseKit.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionDTO {
    private int id;
    private String title;
    private int isEdited;
    private List<Lesson> lessons;
}