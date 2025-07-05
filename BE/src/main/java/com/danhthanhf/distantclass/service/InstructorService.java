package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.exception.EntityNotFoundException;
import com.danhthanhf.distantclass.helper.converters.ConvertService;
import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
import com.danhthanhf.distantclass.entity.CourseKit.Course;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.repository.CourseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructorService {
    private final UserService userService;
    private final CourseRepository courseRepository;
    private final ConvertService convertService;
    private final List<CoursePostStatus> availableStatus = List.of(CoursePostStatus.DRAFT, CoursePostStatus.PUBLISHED, CoursePostStatus.PENDING, CoursePostStatus.REJECTED);

    public ResponseObject getCourseById(UUID courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        var res = convertService.convertToCourseDTO(course);
        return ResponseObject.builder().status(HttpStatus.OK).content(res).build();
    }

    public ResponseObject getAllAvailableCourseByCourseTitleAndCategory(String title, String categoryId, boolean isDeleted, int page, int size) {
        Page<Course> coursePage;

        if (title == null || categoryId == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Title or category id cannot be null").build();
        }
        if(categoryId.equals("0")) {
            coursePage = courseRepository.findByAuthorAndTitleContainingAndStatusInAndDeleted(userService.getCurrentUser(), title, availableStatus, isDeleted, PageRequest.of(page, size));
        }
        else {
            UUID id = UUID.fromString(categoryId);
            coursePage = courseRepository.findByAuthorAndStatusInAndTitleContainingAndCategoriesIdAndDeleted(userService.getCurrentUser(), availableStatus, title, id, isDeleted, PageRequest.of(page, size));
        }

        var result = convertService.convertToPageCourseDTO(coursePage);
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject getAllCourseDeleteByCategoryId(String status, String categoryId, boolean deleted, int page, int size) {
        Page<Course> coursePage;
        if(Objects.equals(categoryId, "0")) { // category == ALL
            if (Objects.equals(status, "ALL"))
                coursePage = courseRepository.findAllByAuthorAndDeleted(userService.getCurrentUser(), deleted, PageRequest.of(page, size));
            else
                coursePage = courseRepository.findAllByAuthorAndStatusAndDeleted(userService.getCurrentUser(), CoursePostStatus.valueOf(status), deleted, PageRequest.of(page, size));
        }
        else {
            UUID uuid = UUID.fromString(categoryId);
            if (Objects.equals(status, "ALL"))
                coursePage = courseRepository.findAllByCategoriesIdAndAuthorAndDeleted(uuid, userService.getCurrentUser(), deleted, PageRequest.of(page, size));
            else
                coursePage = courseRepository.findAllByCategoriesIdAndStatusAndAuthorAndDeleted(uuid, CoursePostStatus.valueOf(status), userService.getCurrentUser(), deleted, PageRequest.of(page, size));
        }

        var courses = convertService.convertToPageCourseDTO(coursePage);

        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }

    public ResponseObject getAllByStatusCourse(String status, String categoryId, int page, int size) {
        Page<Course> coursePage;
        status = status.toUpperCase();

        if(Objects.equals(categoryId, "0")) {
            if(Objects.equals(status, "ALL"))
                coursePage = courseRepository.findAllByStatusInAndDeletedAndAuthor(availableStatus, false, userService.getCurrentUser(), PageRequest.of(page, size));
            else
                coursePage = courseRepository.findAllByStatusInAndDeletedAndAuthor(List.of(CoursePostStatus.valueOf(status)), false, userService.getCurrentUser(), PageRequest.of(page, size));
        }
        else {
            UUID uuid = UUID.fromString(categoryId);
            if(Objects.equals(status, "ALL"))
                coursePage = courseRepository.findAllByCategoriesIdAndStatusInAndDeletedAndAuthor(uuid, availableStatus, false, userService.getCurrentUser(), PageRequest.of(page, size));
            else
                coursePage = courseRepository.findAllByCategoriesIdAndStatusInAndDeletedAndAuthor(uuid, List.of(CoursePostStatus.valueOf(status)), false, userService.getCurrentUser(), PageRequest.of(page, size));
        }
        var courses = convertService.convertToPageCourseDTO(coursePage);
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }

    public ResponseObject getAllDraftOrPublishCourse(int page, int size) {
        return ResponseObject.builder().status(HttpStatus.OK).content(courseRepository.findAllByStatusIn(availableStatus, PageRequest.of(page, size))).build();
    }

    public ResponseObject getAllCoursePublicByCategoryId(String categoryId, int page, int size) {
        if(categoryId.isEmpty()) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("UUID string cannot be null").build();
        }
        User user = userService.getCurrentUser();
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.UNAUTHORIZED).message("user not found").build();
        }
        Page<Course> courses = null;
        if(Objects.equals(categoryId, "0")) { // category == ALL
//            courses = courseRepository.findAllByIsPublicAndDeleted(true, false, PageRequest.of(page, size));
        }
        else {
            UUID uuid = UUID.fromString(categoryId);
//            courses = courseRepository.findAllByAuthorAndCategoriesIdAndIsPublic(user, uuid, true, PageRequest.of(page, size));
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }


}
