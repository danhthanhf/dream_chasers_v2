package com.dreamchasers.recoverbe.controller.secured;

import com.dreamchasers.recoverbe.enums.CommentFilterType;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequestMapping("/api/v1/courses")
@RestController
@RequiredArgsConstructor
public class SecuredCourseController {
    private final CourseService courseService;

    @GetMapping("/{courseId}/asks")
    public ResponseEntity<ResponseObject> getAsks(@PathVariable UUID courseId, @RequestParam(required = false) UUID lessonId, @RequestParam(defaultValue = "desc") String orderBy, @RequestParam CommentFilterType askFilterType, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        var result = courseService.getFilteredComment(courseId, lessonId, orderBy, askFilterType, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
