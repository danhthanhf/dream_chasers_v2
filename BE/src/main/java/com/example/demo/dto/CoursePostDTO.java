package com.example.demo.dto;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Post;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class CoursePostDTO {
    private List<Post> posts;
    private List<Course> courses;
}
