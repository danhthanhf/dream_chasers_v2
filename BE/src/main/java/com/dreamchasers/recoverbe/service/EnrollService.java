package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.entity.CourseKit.Enrollment;
import com.dreamchasers.recoverbe.entity.CourseKit.Progress;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import com.dreamchasers.recoverbe.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public List<Progress> getProgressFromCourse(Course course) {
        return course.getSections().stream()
                .flatMap(section -> section.getLessons().stream())
                .map(lesson -> Progress.builder()
                        .lesson(lesson)
                        .isCompleted(false)
                        .build())
                .collect(Collectors.toList());
    }

    public boolean isUserEnrolled(UUID userId, UUID courseId) {
        return enrollmentRepository.findByCourseIdAndUserId(courseId, userId).isPresent();
    }

    public void enrollCourse(User user, UUID courseId) {
        if(isUserEnrolled(user.getId(), courseId)) {
            return;
        }

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        List<Progress> progresses = getProgressFromCourse(course);
        var enroll = Enrollment.builder()
                .course(course)
                .user(user)
                .progresses(progresses)
                .build();
        enrollmentRepository.save(enroll);
    }

}
