package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/private/course")
public class CourseController {
    private final CourseService courseService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getCourseByCourseTitle(@RequestParam("title") String title,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "5") int size
            , @RequestParam(defaultValue = "false") boolean isDeleted) {
        var result = courseService.getAllCourseByCourseTitle(title, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseObject> create(@RequestPart CourseDTO course) {
        var result = courseService.createCourse(course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
