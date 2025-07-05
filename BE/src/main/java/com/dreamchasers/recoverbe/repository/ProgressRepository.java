package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.CourseKit.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, UUID> {
    Optional<Progress> findByLessonId(UUID lessonId);
}
