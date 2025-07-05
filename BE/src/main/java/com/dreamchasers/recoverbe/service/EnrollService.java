package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.entity.CourseKit.Enrollment;
import com.dreamchasers.recoverbe.entity.CourseKit.Progress;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import com.dreamchasers.recoverbe.repository.EnrollmentRepository;
import com.dreamchasers.recoverbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public void updateFriendsForUserEnrolledCourse() {
        List<Enrollment> allEnrollment = enrollmentRepository.findAll();
        allEnrollment.forEach(enrollment -> {
            var course = enrollment.getCourse();
            var instructor = course.getAuthor();
            if(enrollment.getUser().getFriends().contains(instructor) || instructor.getId().equals(enrollment.getUser().getId())) {
                return;
            }
            addFriendWithInstructor(enrollment.getUser(), instructor);
        });
    }

    public List<Enrollment> getByUser(User user) {
        return enrollmentRepository.findByUser(user);
    }

    public Enrollment getByUserAndCourseId(User user, UUID courseId) {
        return enrollmentRepository.findByUserAndCourseId(user, courseId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));
    }

    public Enrollment getByCourseAndUser(UUID userId, UUID courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));
    }

    public List<Progress> getProgressFromCourse(Course course) {

        List<Progress> listProgress =  course.getSections().stream()
                .flatMap(section -> section.getLessons().stream())
                .map((lesson) -> Progress.builder()
                        .lesson(lesson)
                        .isCompleted(false)
                        .duration(lesson.getDuration())
                        .isLocked(true)
                        .build())
                .toList();

        // unlock the first lesson
        if(!listProgress.isEmpty())
            listProgress.get(0).setLocked(false);

        return listProgress;
    }

    public boolean isUserEnrolled(UUID userId, UUID courseId) {
        return enrollmentRepository.findByCourseIdAndUserId(courseId, userId).isPresent();
    }

    public int getSumOfLesson(Course course) {
        return course.getSections().stream().mapToInt(s -> s.getLessons().size()).sum();
    }

    public void addFriendWithInstructor(User user, User instructor) {
        if(user.getFriends().contains(instructor)) {
            return;
        }
        instructor.getFriends().add(user);
        user.getFriends().add(instructor);
        userRepository.save(user);
    }

    public void enrollCourse(User user, UUID courseId) {
        if(isUserEnrolled(user.getId(), courseId)) {
            return;
        }

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        course.setTotalRegister(course.getTotalRegister() + 1);

        // add friend to chat with instructor
        var instructor = course.getAuthor();
        addFriendWithInstructor(user, instructor);


        List<Progress> progresses = getProgressFromCourse(course);

        var enroll = Enrollment.builder()
                .course(course)
                .user(user)
                .totalLessons(getSumOfLesson(course))
                .progresses(progresses)
                .build();
        enrollmentRepository.save(enroll);
    }

}
