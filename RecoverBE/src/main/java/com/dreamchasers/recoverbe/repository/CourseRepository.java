package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.CourseKit.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

}
