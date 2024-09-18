package com.example.demo.dto;

import com.example.demo.entity.data.Lesson;
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
