package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.*;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.dto.CourseDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Data
@RequiredArgsConstructor
@Service
@Transactional
public class CourseService {
    private final CourseRepository courseRepository;
    private final CloudService cloudService;
    private final CategoryService categoryService;
    private final LessonService lessonService;
    private final SectionService sectionService;
    private final CoursePostService coursePostService;

    public ResponseObject getCourseById(int id, boolean isDeleted) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().mess("Course is not exist!").status(HttpStatus.BAD_REQUEST).build();
        }
        var sections = sectionService.getSectionsByCourse(course);
        course.setSections(sections);
        return ResponseObject.builder().content(course).status(HttpStatus.OK).build();
    }

    public ResponseObject getAllCourse(int page, int size) {
        var courses = courseRepository.findAllByIsDeleted(false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get successfully").content(courses).build();
    }

    public ResponseObject getAllCourseDeleted(int page, int size) {
        var courses = courseRepository.findAllByIsDeleted(true, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get successfully").content(courses).build();
    }

    public ResponseObject updateCourse(int id, CourseDTO courseDTO) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().mess("Course does not exist!").status(HttpStatus.BAD_REQUEST).build();
        }

        course.setThumbnail(courseDTO.getThumbnail());
        course.setVideo(courseDTO.getVideo());
        course.setDescription(courseDTO.getDescription());
        course.setDiscount(courseDTO.getDiscount());
        course.setTitle(courseDTO.getTitle());
        course.setPrice(courseDTO.getPrice());

        sectionService.updateSections(courseDTO, course);

        if (courseDTO.getIsEditedCategories() == 1)
            categoryService.updateCategoriesForCourse(course, courseDTO.getCategories());

        courseRepository.save(course);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update successfully").build();
    }

    public ResponseObject addCourse(CourseDTO request) {
        var course = courseRepository.findByTitle(request.getTitle()).orElse(null);
        if (course != null) {
            return ResponseObject.builder().mess("Course is already exist").status(HttpStatus.BAD_REQUEST).build();
        }

        Course newCourse = Course.builder().price(request.getPrice())
                .title(request.getTitle())
                .description(request.getDescription())
                .discount(request.getDiscount())
                .date(LocalDateTime.now())
                .thumbnail(request.getThumbnail())
                .video(request.getVideo())
                .build();

        sectionService.addListSectionDtoToCourse(newCourse, request.getSections());
        newCourse.setCategories(categoryService.addCategoriesForCourse(newCourse, request.getCategories()));

        courseRepository.save(newCourse);
        return ResponseObject.builder().mess("Create success").status(HttpStatus.OK).build();
    }

    public ResponseObject softDelete(int id) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content(courseRepository.findAllByIsDeleted(false, PageRequest.of(0, 5))).mess("Course is not exist!").build();
        }
        course.setDeleted(true);
        courseRepository.save(course);
        return ResponseObject.builder().mess("Delete course successfully!").content(courseRepository.findAllByIsDeleted(false, PageRequest.of(0, 5))).status(HttpStatus.OK).build();
    }

    public ResponseObject hardDelete(int id) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        courseRepository.delete(course);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject getAllCourseByCategoryIdAndTitle(int id, String title) {
        List<Course> result = courseRepository.findAll();
        if (!Objects.equals(title, ""))
            result = result.stream().filter(c -> c.getTitle().contains(title)).toList();
        if (id != -1) {
            result = result.stream().filter(c -> c.getCategories().stream().anyMatch(ca -> ca.getId() == id)).toList();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject getAllCourseByCategoryId(int id, int page, int size) {
        if (id == -1) {
            return ResponseObject.builder().status(HttpStatus.OK).content(courseRepository.findAll(PageRequest.of(page, size))).mess("Get data successfully").build();
        }
        var result = courseRepository.findByCategoryId(id, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject getAllCourseDeletedByCategoryId(int id, int page, int size) {
        if (id == -1) {
            return ResponseObject.builder().status(HttpStatus.OK).content(courseRepository.findAllByIsDeleted(true, PageRequest.of(page, size))).mess("Get data successfully").build();
        }
        var result = courseRepository.findByCategoryIdAndIsDeleted(id, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject getAllCourseByCourseTitle(String title, boolean isDeleted, int page, int size) {
        var result = courseRepository.findByTitleContainingAndIsDeleted(title, isDeleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).mess("Get data successfully").build();
    }

    public ResponseObject restoreCourseById(int id) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null)
            return ResponseObject.builder().mess("Course does not exist").status(HttpStatus.BAD_REQUEST).build();
        course.setDeleted(false);
        courseRepository.save(course);
        return ResponseObject.builder().content(courseRepository.findAllByIsDeleted(true, PageRequest.of(0, 5))).mess("Restore successfully").status(HttpStatus.OK).build();
    }

    public ResponseObject getAllByPageable(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var courses = courseRepository.findAllByIsDeleted(false, pageable);
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }
}
