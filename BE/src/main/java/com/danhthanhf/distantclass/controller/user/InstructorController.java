package com.danhthanhf.distantclass.controller.User;

import com.danhthanhf.distantclass.dto.CourseDTO;
import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
import com.danhthanhf.distantclass.service.CourseService;
import com.danhthanhf.distantclass.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
public class InstructorController {
    private final CourseService courseService;
    private final InstructorService instructorService;



    @GetMapping("/courses/{courseId}")
    public ResponseEntity<ResponseObject> getCourseById(@PathVariable UUID courseId) {
        var result = instructorService.getCourseById(courseId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/courses/available")
    public ResponseEntity<ResponseObject> getAvailableCourseByTitle(@RequestParam("title") String title,
                                                           @RequestParam String categoryId,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "5") int size
            , @RequestParam(defaultValue = "false") boolean isDeleted) {
        var result = instructorService.getAllAvailableCourseByCourseTitleAndCategory(title, categoryId, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/courses/available/getAll")
    public ResponseEntity<ResponseObject> getAllAvailableCourse(@RequestParam String status,@RequestParam String categoryId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = instructorService.getAllByStatusCourse(status, categoryId, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/courses/category")
    public ResponseEntity<ResponseObject> getCourseByCategoryIdAndStatus(@RequestParam String categoryId, @RequestParam String status, @RequestParam(defaultValue = "false") boolean deleted, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = instructorService.getAllCourseDeleteByCategoryId(status.toUpperCase(), categoryId, deleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/courses/delete/soft/{id}")
    public ResponseEntity<ResponseObject> softDeleteCourse(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = courseService.softDelete(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/courses/delete/soft/list")
    public ResponseEntity<ResponseObject> softDeleteListCourse(@RequestParam List<UUID> ids) {
        var result = courseService.softDeleteList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/courses/{courseId}/status")
    public ResponseEntity<ResponseObject> changeCourseStatus(@PathVariable UUID courseId, @RequestBody CoursePostStatus status) {
        ResponseObject result = courseService.authorChangeCourseStatus(courseId, status);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<ResponseObject> updateCourse(@PathVariable UUID courseId, @RequestBody CourseDTO course) {
        var result = courseService.updateCourse(courseId, course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/courses")
    public ResponseEntity<ResponseObject> createCourse(@RequestBody CourseDTO course) {
        var result = courseService.createCourse(course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/courses/restore/{id}")
    public ResponseEntity<ResponseObject> restoreCourse(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = courseService.restoreCourseById(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/courses/restore/list")
    public ResponseEntity<ResponseObject> restoreListCourse(@RequestParam List<UUID> ids) {
        var result = courseService.restoreList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
