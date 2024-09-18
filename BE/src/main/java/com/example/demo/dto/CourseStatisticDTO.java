package com.example.demo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class CourseStatisticDTO {
    private int id;
    private String title;
    private String thumbnail;
    private int price;
}
