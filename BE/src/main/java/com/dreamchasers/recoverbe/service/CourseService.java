package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.dto.StatusChangeDTO;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.Handle.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.entity.CourseKit.Section;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.enums.CoursePrice;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final SectionService sectionService;
    private final CategoryService categoryService;
    private final ConvertService convertService;
    private final NotificationService notificationService;
    private final List<CoursePostStatus> availableStatus = List.of(CoursePostStatus.DRAFT, CoursePostStatus.PUBLISHED, CoursePostStatus.PENDING, CoursePostStatus.REJECTED);

    public User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Course changeStatus(UUID courseId, StatusChangeDTO statusChangeDTO) {
        var course = courseRepository.findById(courseId).orElseThrow(() -> new NoSuchElementException("Course does not exist"));
        if(statusChangeDTO.getStatus() == CoursePostStatus.PUBLISHED && course.getStatus() == CoursePostStatus.DRAFT)
            course.setStatus(CoursePostStatus.PENDING);
        else if(statusChangeDTO.getStatus() == CoursePostStatus.REJECTED) {
            course.setReasonReject(statusChangeDTO.getDetail());
            course.setStatus(statusChangeDTO.getStatus());
        }
        else {
            course.setReasonReject(null);
            course.setStatus(statusChangeDTO.getStatus());
        }
        return courseRepository.save(course);
    }

    public ResponseObject changeCourseStatus(UUID courseId, StatusChangeDTO statusChangeDTO) {
        try {
            var course = changeStatus(courseId, statusChangeDTO);

            notificationService.sendNotificationToUser(null, course.getAuthor(), null, notificationService.getNotificationType(statusChangeDTO.getStatus(), true), course.getTitle(), "Your course was " + course.getStatus() + " by ADMIN",statusChangeDTO.getDetail());

            return ResponseObject.builder().status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseObject.builder().message(e.getMessage()).status(HttpStatus.BAD_REQUEST).build();
        }
    }

    public ResponseObject authorChangeCourseStatus(UUID courseId, CoursePostStatus status) {
        try {
            var course = courseRepository.findById(courseId).orElseThrow(() -> new NoSuchElementException("Course does not exist"));
            course.setStatus(status);
            if(course.getAuthor() != getCurrentUser()) {
                return ResponseObject.builder().message("You are not the author of this course").status(HttpStatus.BAD_REQUEST).build();
            }
            courseRepository.save(course);
            return ResponseObject.builder().status(HttpStatus.OK).build();
        } catch (NoSuchElementException e) {
            return ResponseObject.builder().message(e.getMessage()).status(HttpStatus.BAD_REQUEST).build();
        }
    }

    public ResponseObject getByTitle(String title) {
        var course = courseRepository.findByTitle(title).orElseThrow(() -> new EntityNotFoundException("Course does not exist"));

        var response = convertService.convertToCourseDTO(course);
        return ResponseObject.builder().content(response).status(HttpStatus.OK).build();
    }

    public Page<Course> getAllByStatus(CoursePostStatus isPublish, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return courseRepository.findAllByStatusAndDeleted(isPublish, false, pageable);
    }

    public ResponseObject getAllPublish(int page, int size) {
        var pageCourse = getAllByStatus(CoursePostStatus.PUBLISHED, page, size);
        var courses = convertService.convertToPageCourseDTO(pageCourse);
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }

    public ResponseObject getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var courses = courseRepository.findAllByDeleted(false, pageable);
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }

    public ResponseObject restoreList(List<UUID> ids) {
        ids.stream().map(id -> courseRepository.findById(id).orElse( null)).forEach(c -> {
            if(c != null) {
                c.setDeleted(false);
                courseRepository.save(c);
            }
        });
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject restoreCourseById(UUID id, int page, int size) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null)
            return ResponseObject.builder().message("Course does not exist").status(HttpStatus.BAD_REQUEST).build();
        course.setDeleted(false);
        courseRepository.save(course);
        return ResponseObject.builder().content(courseRepository.findAllByDeleted(true, PageRequest.of(page, size))).status(HttpStatus.OK).build();
    }

    public ResponseObject softDelete(UUID id, int page, int size) {
        var course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content(courseRepository.findAllByDeleted(false, PageRequest.of(page, size))).message("Course is not exist!").build();
        }
        course.setDeleted(true);
        courseRepository.save(course);
        return ResponseObject.builder().content(courseRepository.findAllByDeleted(false, PageRequest.of(0, 5))).status(HttpStatus.OK).build();
    }

    public ResponseObject softDeleteList(List<UUID> ids) {
        ids.stream().map(id -> getCourseById(id, false)).forEach(responseObject -> {
            Course course = (Course) responseObject.getContent();
            if(course != null) {
                courseRepository.save(course);
                course.setDeleted(true);
            }
        });
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject getCourseById(UUID id, boolean isDeleted) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null || course.isDeleted()) {
            return ResponseObject.builder().message("Course is not exist!").status(HttpStatus.BAD_REQUEST).build();
        }
        var sections = sectionService.getSectionsByCourse(course);
        course.setSections(sections);
        return ResponseObject.builder().content(course).status(HttpStatus.OK).build();
    }

    public ResponseObject getAllCourseByCategoryId(String status, String categoryId, boolean deleted, int page, int size) {
        Page<Course> coursePage;
        if(Objects.equals(categoryId, "0")) { // category == ALL
            if(Objects.equals(status, "ALL"))
                coursePage = courseRepository.findAllByDeleted(deleted, PageRequest.of(page, size));
            else
                coursePage = courseRepository.findAllByStatusAndDeleted(CoursePostStatus.valueOf(status),deleted, PageRequest.of(page, size));
        }
        else {
            UUID uuid = UUID.fromString(categoryId);
            if (Objects.equals(status, "ALL"))
                coursePage = courseRepository.findAllByCategoriesIdAndDeleted(uuid, deleted, PageRequest.of(page, size));

            else
                coursePage = courseRepository.findAllByCategoriesIdAndStatusAndDeleted(uuid,  CoursePostStatus.valueOf(status), deleted, PageRequest.of(page, size));
        }
        var courses = convertService.convertToPageCourseDTO(coursePage);
        return ResponseObject.builder().status(HttpStatus.OK).message("Get successfully").content(courses).build();
    }

    public ResponseObject getAllCourse(boolean deleted, int page, int size) {
        var courses = courseRepository.findAllByDeleted(deleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).message("Get successfully").content(courses).build();
    }

    public ResponseObject getAllCourseByCourseTitleAndCategory(String title, String categoryId, boolean isDeleted, int page, int size) {
        if (title == null || categoryId == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Title or category id cannot be null").build();
        }
        if(categoryId.equals("0")) {
            var result = courseRepository.findByTitleContainingAndDeleted(title, isDeleted, PageRequest.of(page, size));
            return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
        }
        UUID id = UUID.fromString(categoryId);
        var result = courseRepository.findByTitleContainingAndCategoriesIdAndDeleted(title, id, isDeleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public Course createStatusForCourse(Course course, CoursePostStatus status) {
        if(status == CoursePostStatus.PUBLISHED)
            course.setStatus(CoursePostStatus.PENDING);
        return course;
    }

    public ResponseObject createCourse(CourseDTO request) {
        if(request.getTitle() == null || request.getCategories() == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Title or categories cannot be null").build();
        }

        final ResponseObject[] res = new ResponseObject[1];
        courseRepository.findByTitle(request.getTitle()).ifPresentOrElse((course) -> res[0] = ResponseObject.builder().message("Course is already exist!").status(HttpStatus.BAD_REQUEST).build(), () -> {
            var categories = categoryService.getListByName(request.getCategories());
            categoryService.UpdateToTalCourseForList(categories, true);



            Course newCourse = Course.builder().price(CoursePrice.fromInt(request.getPrice()))
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .discount(request.getDiscount())
                    .thumbnail(request.getThumbnail())
                    .video(request.getVideo())
                    .categories(categories)
                    .author(getCurrentUser())
                    .deleted(false)
                    .build();

            newCourse = createStatusForCourse(newCourse, request.getStatus());

            if(request.getSections() != null && !request.getSections().isEmpty()) {
                var sections = sectionService.createListSectionFromDTO(request.getSections());
                var totalDuration = sections.stream().mapToInt(Section::getTotalDuration).sum();
                newCourse.setTotalDuration(totalDuration);
                newCourse.setSections(sections);
            }

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
