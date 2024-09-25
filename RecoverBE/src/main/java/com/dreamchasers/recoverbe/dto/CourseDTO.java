package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.model.CourseKit.Progress;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

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
    private List<String> categories;
    @JsonProperty("sections")
    private List<SectionDTO> sections;
    private String thumbnail;
    private String video;
    private int isEditedCategories;
    private int isEdited;
    private Progress progress;
}
