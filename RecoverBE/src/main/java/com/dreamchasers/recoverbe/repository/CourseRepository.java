package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.CourseKit.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Page<Course> findByTitleContainingAndDeleted(String title, boolean isDeleted, Pageable pageable);

    Optional<Course> findByTitle(String title);

    Page<Course> findAllByDeleted(boolean isDeleted, Pageable pageable);
}
