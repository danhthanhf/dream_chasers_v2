package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.model.CourseKit.Category;
import com.dreamchasers.recoverbe.model.CourseKit.Course;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final SectionService sectionService;
    private final CategoryService categoryService;

    public ResponseObject getAllCourse(boolean deleted, int page, int size) {
        var courses = courseRepository.findAllByDeleted(deleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).message("Get successfully").content(courses).build();
    }

    public ResponseObject getAllCourseByCourseTitle(String title, boolean isDeleted, int page, int size) {
        var result = courseRepository.findByTitleContainingAndDeleted(title, isDeleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public Course addCategoriesToCourse(Course course, List<String> categoryNames) {
        for(var nane : categoryNames) {
            Category category = categoryService.getByName(nane);
            if(category != null) {
                course.getCategories().add(category);
            }
        }
        return course;
    }

    public ResponseObject createCourse(CourseDTO request) {
        final ResponseObject[] res = new ResponseObject[1];
        courseRepository.findByTitle(request.getTitle()).ifPresentOrElse((course) -> {
            res[0] = ResponseObject.builder().message("Course is already exist!").status(HttpStatus.BAD_REQUEST).build();
        }, () -> {
            var categories = categoryService.getListByName(request.getCategories());
            var sections = sectionService.createListSectionFromDTO(request.getSections());
            Course newCourse = Course.builder().price(request.getPrice())
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .discount(request.getDiscount())
                    .thumbnail(request.getThumbnail())
                    .video(request.getVideo())
                    .categories(categories)
                    .sections(sections)
                    .build();
            courseRepository.save(newCourse);

            res[0] = ResponseObject.builder().status(HttpStatus.OK).build();
        });

        return res[0];
    }

    public ResponseObject updateCourse(UUID id, CourseDTO courseDTO) {
        final ResponseObject[] res = new ResponseObject[1];
        courseRepository.findById(id).ifPresentOrElse(c -> {
            c.setThumbnail(courseDTO.getThumbnail());
            c.setVideo(courseDTO.getVideo());
            c.setDescription(courseDTO.getDescription());
            c.setDiscount(courseDTO.getDiscount());
            c.setTitle(courseDTO.getTitle());
            sectionService.updateSections(courseDTO, c);

            if (courseDTO.getIsEditedCategories() == 1)
                categoryService.updateCategoriesForCourse(c, courseDTO.getCategories());
            courseRepository.save(c);
            res[0] = ResponseObject.builder().status(HttpStatus.OK).build();
        }, () -> res[0] = ResponseObject.builder().message("Course does not exist!").status(HttpStatus.BAD_REQUEST).build());
        return res[0];
    }

}
