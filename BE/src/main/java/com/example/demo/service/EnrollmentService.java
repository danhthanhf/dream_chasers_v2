package com.example.demo.service;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Enrollment;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressService progressService;

    @Autowired
    public EnrollmentService(EnrollmentRepository enrollmentRepository, ProgressService progressService) {
        this.enrollmentRepository = enrollmentRepository;
        this.progressService = progressService;
    }

    public void createNewEnrollment(User user, Course course) {
        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .isCompleted(false)
                .progressList(progressService.createProgressList(course))
                .progress(0)
                .build();
        enrollmentRepository.save(enrollment);
    }
}
