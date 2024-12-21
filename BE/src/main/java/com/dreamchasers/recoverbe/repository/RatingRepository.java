package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.CourseKit.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    Page<Rating> findAllByCourseId(UUID courseId, Pageable pageable);

    Optional<Rating> findByUserIdAndCourseId(UUID userId, UUID courseId);
}
