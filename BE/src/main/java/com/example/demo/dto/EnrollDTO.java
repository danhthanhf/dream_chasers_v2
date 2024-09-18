package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
public class EnrollDTO {

    private String email;
    private int courseId;
    private List<Integer> lessonIds;
}
