package com.example.demo.controller.PublicController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.CourseDTO;
import com.example.demo.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/public/course")
@RequiredArgsConstructor
public class PCourseController {
    private final CourseService courseService;

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllByPageable(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllByPageable(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCourseById(@PathVariable int id, @RequestParam boolean isDeleted){
        var result = courseService.getCourseById(id, isDeleted);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/category")
    public ResponseEntity<ResponseObject> getCourseByCategoryId(@RequestParam("id") int id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllCourseByCategoryId(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}