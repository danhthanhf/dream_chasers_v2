package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/course")
public class PCourseController {
    private final CourseService courseService;

    @GetMapping
    public String greeting() {
        return "Hello from Course Controller";
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCourseById(@PathVariable UUID id, @RequestParam boolean isDeleted){
        var result = courseService.getCourseById(id, isDeleted);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
