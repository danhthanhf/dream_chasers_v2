package com.example.demo.dto;

import com.example.demo.entity.data.Progress;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder

@AllArgsConstructor
@RequiredArgsConstructor
public class CourseDTO {
    private String title;
    private int price;
    private int discount;
    private String description;
    private LocalDateTime date;
    private List<Integer> categories;
    @JsonProperty("sections")
    private List<SectionDTO> sections;
    private String thumbnail;
    private String video;
    private int isEditedCategories;
    private int isEdited;
    private Progress progress;

}
