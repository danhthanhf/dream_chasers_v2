package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CommentDTOInCourse;
import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.dto.StatusChangeDTO;
import com.dreamchasers.recoverbe.entity.CourseKit.*;
import com.dreamchasers.recoverbe.entity.User.Comment;
import com.dreamchasers.recoverbe.entity.User.QComment;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.CommentFilterType;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.converters.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.enums.CoursePrice;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import com.dreamchasers.recoverbe.repository.RatingRepository;
import com.dreamchasers.recoverbe.repository.UserRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final SectionService sectionService;
    private final CategoryService categoryService;
    private final ConvertService convertService;
    private final JPAQueryFactory queryFactory;


    public ResponseObject getFilteredComment(UUID courseId, UUID lessonId, String orderBy, CommentFilterType type, int page, int size) {

        BooleanBuilder builder = new BooleanBuilder();
        QComment comment = QComment.comment;
        JPAQuery<Comment> query;
        User user = userRepository.findById(getCurrentUser().getId()).orElseThrow(() -> new NoSuchElementException("User does not exist"));

        builder.and(comment.courseId.eq(courseId).and(comment.deleted.eq(false)));


        if(lessonId != null) {
            builder.and(comment.lessonId.eq(lessonId));
        }

        if(type == CommentFilterType.MY_ASK) {
            builder.and(comment.author.email.eq(user.getEmail()));
        }
//        else if(type == CommentFilterType.MY_FOLLOWING) {
//            builder.and(comment.in(user.getFollowedComment()));
//        }

        if ("asc".equalsIgnoreCase(orderBy)) {
            query = queryFactory.selectFrom(comment).where(builder).orderBy(comment.createdAt.asc());
        } else {
            query = queryFactory.selectFrom(comment).where(builder).orderBy(comment.createdAt.desc());

        }
        Long totalElements = queryFactory
                .select(comment.count())
                .from(comment)
                .where(builder)
                .fetchOne();

        List<Comment> listAsk = query.limit(size).offset((long) page * size).fetch();
        var listAskDTO = convertService.convertToListCommentDTOInCourse(listAsk);
//        updateFollowedInResponse(listAskDTO, user);

        PageImpl<CommentDTOInCourse> pageResult = new PageImpl<>(listAskDTO, PageRequest.of(page, size), totalElements);
        return ResponseObject.builder().status(HttpStatus.OK).content(pageResult).build();
    }

//    private void updateFollowedInResponse(List<CommentDTOInCourse> commentDTOS, User user) {
//        commentDTOS.forEach(commentDTO -> {
//            if(user.getFollowedComment().contains(commentDTO.getId())) {
//                commentDTO.setFollowed(true);
//            }
//        });
//    }

    public ResponseObject getRatingsByStarAndComment(UUID courseId, String comment, int star, int page, int size) {
        var rating = QRating.rating1;

        BooleanBuilder builder = new BooleanBuilder();

        builder.and(rating.courseId.eq(courseId));

        if(comment != null && !comment.isEmpty()) {
            builder.and(rating.comment.containsIgnoreCase(comment));
        }

        if(star > 0 && star <= 5) {
            builder.and(rating.rating.eq((double)star));
        }

        JPAQuery<Rating> ratings = queryFactory.selectFrom(rating)
                .where(builder);

        var list = ratings.fetch();
        var totalElements = list.size();

        return ResponseObject.builder().status(HttpStatus.OK).content(new PageImpl<>(list, PageRequest.of(page, size), totalElements)).build();
    }

    public User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public ResponseObject getRatingStatistic(UUID courseId) {
        var count = courseRepository.countRating(courseId);

        Page<Rating> latestRating = ratingRepository.findAllByCourseId(courseId, PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")));

        var statistic = convertService.convertToStatisticRating(count, latestRating);

        return ResponseObject.builder().status(HttpStatus.OK).content(statistic).build();
    }

    public ResponseObject adminUpdateCourseStatus(UUID courseId, StatusChangeDTO statusChangeDTO) {
        var course = courseRepository.findById(courseId).orElseThrow(() -> new NoSuchElementException("Course does not exist"));

        if(statusChangeDTO.getStatus() == CoursePostStatus.REJECTED) {
            course.setReasonReject(statusChangeDTO.getDetail());
            course.setStatus(statusChangeDTO.getStatus());
        }
        else {
            course.setReasonReject(null);
            course.setStatus(statusChangeDTO.getStatus());
        }
        courseRepository.save(course);

        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    private void changeStatus(Course course, CoursePostStatus status) {
        if(status == CoursePostStatus.PUBLISHED) {
            course.setStatus(CoursePostStatus.PENDING);
        }
        else {
            course.setStatus(status);
        }
        courseRepository.save(course);
    }

    public ResponseObject authorChangeCourseStatus(UUID courseId, CoursePostStatus status) {
        try {
            var course = courseRepository.findById(courseId).orElseThrow(() -> new NoSuchElementException("Course does not exist"));

            if(!course.getAuthor().getEmail().equals(getCurrentUser().getEmail())) {
                return ResponseObject.builder().message("You are not the author of this course").status(HttpStatus.BAD_REQUEST).build();
            }

            changeStatus(course, status);

            courseRepository.save(course);
            var message = "Your course " + course.getTitle() + " has been " + course.getStatus().toString().toLowerCase();
            return ResponseObject.builder().status(HttpStatus.OK).message(message).build();
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
        ids.stream().map(id -> getCourseByIdAndDeleted(id, false)).forEach(responseObject -> {
            Course course = (Course) responseObject.getContent();
            if(course != null) {
                courseRepository.save(course);
                course.setDeleted(true);
            }
        });
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public Course getById(UUID id) {
        return courseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Course does not exist"));
    }

    public ResponseObject getCourseById(UUID id) {
        return ResponseObject.builder().content(getById(id)).status(HttpStatus.OK).build();
    }

    public ResponseObject getCourseByIdAndDeleted(UUID id, boolean isDeleted) {
        Course course = getById(id);
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
        else course.setStatus(status);
        return course;
    }

    public ResponseObject createCourse(CourseDTO request) {

        if(request.getTitle() == null || request.getCategories() == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Title or categories cannot be null").build();
        }
        courseRepository.findByTitle(request.getTitle()).ifPresent((course) -> {
            throw new IllegalArgumentException("Course is already exist!");
        });

            var categories = categoryService.getListByName(request.getCategories());

            categoryService.UpdateCountTotalCourseForListCategory(categories, true);

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


        return ResponseObject.builder().status(HttpStatus.OK).build();
    }

    public ResponseObject updateCourse(UUID id, CourseDTO courseDTO) {
        var course = courseRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Course does not exist"));

            course.setThumbnail(courseDTO.getThumbnail());
            course.setVideo(courseDTO.getVideo());
            course.setDescription(courseDTO.getDescription());
            course.setDiscount(courseDTO.getDiscount());
            course.setTitle(courseDTO.getTitle());
            course.setStatus(courseDTO.getStatus());
            course.setPrice(CoursePrice.fromInt(courseDTO.getPrice()));

            sectionService.updateSections(courseDTO, course);
            var newCategory = categoryService.updateCategoriesForCourse(course.getCategories(), courseDTO.getCategories());
            course.setCategories(newCategory);

            courseRepository.save(course);

        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

}
