package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.dto.StatusChangeDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/private/courses")
public class CourseController {
    private final CourseService courseService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getCourseByTitle(@RequestParam("title") String title,
                                                                 @RequestParam String categoryId,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "5") int size
            , @RequestParam(defaultValue = "false") boolean isDeleted) {
        var result = courseService.getAllCourseByCourseTitleAndCategory(title, categoryId, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAllDeleted")
    public ResponseEntity<ResponseObject> getAllDeleted(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllCourse(true, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCourseById(@PathVariable UUID id) {
        var result = courseService.getCourseById(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "5") int size) {
        var result = courseService.getAllCourse(false, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/category")
    public ResponseEntity<ResponseObject> getCourseByCategoryIdAndStatus(@RequestParam String categoryId, @RequestParam String status, @RequestParam(defaultValue = "false") boolean deleted, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        if (categoryId == null) {
            return ResponseEntity.badRequest().body(ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("UUID string cannot be null").build());
        }
        var result = courseService.getAllCourseByCategoryId(status.toUpperCase(), categoryId, deleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseObject> create(@RequestPart CourseDTO course) {
        var result = courseService.createCourse(course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{courseId}/status")
    public ResponseEntity<ResponseObject> changeCourseStatus(@PathVariable UUID courseId, @RequestBody StatusChangeDTO statusChangeDTO) {
        ResponseObject result = courseService.adminUpdateCourseStatus(courseId, statusChangeDTO);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ResponseObject> updateCourse(@PathVariable UUID id
            , @RequestPart CourseDTO course
    )  {

        var result = courseService.updateCourse(id, course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/delete/soft/{id}")
    public ResponseEntity<ResponseObject> softDelete(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = courseService.softDelete(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/delete/soft/list")
    public ResponseEntity<ResponseObject> softDeleteList(@RequestParam List<UUID> ids) {
        var result = courseService.softDeleteList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/restore/{id}")
    public ResponseEntity<ResponseObject> restoreCourse(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = courseService.restoreCourseById(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/restore/list")
    public ResponseEntity<ResponseObject> restoreListCourse(@RequestParam List<UUID> ids) {
        var result = courseService.restoreList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


}
