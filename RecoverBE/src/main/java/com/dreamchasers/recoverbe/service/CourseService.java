package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.model.CourseKit.Category;
import com.dreamchasers.recoverbe.model.CourseKit.Course;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final SectionService sectionService;
    private final CategoryService categoryService;

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
            res[0] = ResponseObject.builder().message("Khóa học đã tồn tại!").status(HttpStatus.BAD_REQUEST).build();
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

}
