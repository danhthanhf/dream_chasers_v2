package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.service.CourseService;
import com.dreamchasers.recoverbe.service.InstructorService;
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


    @GetMapping("/course/available")
    public ResponseEntity<ResponseObject> getAvailableCourseByTitle(@RequestParam("title") String title,
                                                           @RequestParam String categoryId,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "5") int size
            , @RequestParam(defaultValue = "false") boolean isDeleted) {
        var result = instructorService.getAllAvailableCourseByCourseTitleAndCategory(title, categoryId, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/course/available/getAll")
    public ResponseEntity<ResponseObject> getAllAvailableCourse(@RequestParam String status,@RequestParam String categoryId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = instructorService.getAllByStatusCourse(status, categoryId, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/course/category")
    public ResponseEntity<ResponseObject> getCourseByCategoryIdAndStatus(@RequestParam String categoryId, @RequestParam String status, @RequestParam(defaultValue = "false") boolean deleted, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = instructorService.getAllCourseDeleteByCategoryId(status.toUpperCase(), categoryId, deleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/course/delete/soft/{id}")
    public ResponseEntity<ResponseObject> softDeleteCourse(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = courseService.softDelete(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/course/delete/soft/list")
    public ResponseEntity<ResponseObject> softDeleteListCourse(@RequestParam List<UUID> ids) {
        var result = courseService.softDeleteList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/course/{courseId}/status")
    public ResponseEntity<ResponseObject> changeCourseStatus(@PathVariable UUID courseId, @RequestBody CoursePostStatus status) {
        ResponseObject result = courseService.authorChangeCourseStatus(courseId, status);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/course/create")
    public ResponseEntity<ResponseObject> createCourse(@RequestBody CourseDTO course) {
        var result = courseService.createCourse(course);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/course/restore/{id}")
    public ResponseEntity<ResponseObject> restoreCourse(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = courseService.restoreCourseById(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/course/restore/list")
    public ResponseEntity<ResponseObject> restoreListCourse(@RequestParam List<UUID> ids) {
        var result = courseService.restoreList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
