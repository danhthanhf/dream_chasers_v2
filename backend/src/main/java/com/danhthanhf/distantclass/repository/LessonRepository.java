package com.danhthanhf.distantclass.repository;

import com.danhthanhf.distantclass.entity.CourseKit.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
}
