package com.danhthanhf.distantclass.controller.publicApi;

import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.service.CoursePostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/course-post")
@RequiredArgsConstructor
public class PostCourseController {
    private final CoursePostService coursePostService;

    @GetMapping
    public ResponseEntity<ResponseObject> searchCoursePost(@RequestParam String title,
                                                           @RequestParam(defaultValue =  "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {
        var result = coursePostService.getCoursePostByTitle(title, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
