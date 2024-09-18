package com.example.demo.controller.PublicController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.service.CoursePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/course-post")
public class CoursePostController {
    private final CoursePostService coursePostService;

    @Autowired
    public CoursePostController(CoursePostService coursePostService) {
        this.coursePostService = coursePostService;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> searchCoursePost(@RequestParam String title,
                                                           @RequestParam(defaultValue =  "0") int page,
                                                           @RequestParam(defaultValue = "20") int size) {
        var result = coursePostService.getCoursePostByTitle(title, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
