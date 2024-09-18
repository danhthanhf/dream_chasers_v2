package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// NONE, REMOVE, UPDATE, HAS

@Data
@NoArgsConstructor
public class LessonDTO {
    private int id;
    private String linkVideo;
    private String title;
    private String description;
    private LocalDateTime date;
    private String video;
    private boolean isEdited;
    private String actionVideo = "NONE";
    public LessonDTO(String value){}
}