package com.danhthanhf.distantclass.repository;

import com.danhthanhf.distantclass.entity.CourseKit.Enrollment;
import com.danhthanhf.distantclass.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    Optional<Enrollment> findByCourseIdAndUserId(UUID courseId, UUID userId);

    Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);

    Optional<Enrollment> findByUserAndCourseId(User user, UUID courseId);

    List<Enrollment> findByUser(User user);
}
