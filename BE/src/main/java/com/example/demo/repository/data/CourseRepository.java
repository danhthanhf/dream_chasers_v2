package com.example.demo.repository.data;

import com.example.demo.dto.CourseDTO;
import com.example.demo.dto.CourseStatisticDTO;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Section;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
     Optional<Course> findByTitle(String title);

     Page<Course> findAllByIsDeleted(boolean isDeleted, Pageable pageable);

    @Query(value = "select * from course inner join course_category on course.id = course_category.course_id where category_id = :id and course.is_deleted = 0", nativeQuery = true)
    Page<Course> findByCategoryId(int id, Pageable pageable);

    @Query(value = "select * from course inner join course_category on course.id = course_category.course_id where category_id = :id and course.is_deleted = 1", nativeQuery = true)
    Page<Course> findByCategoryIdAndIsDeleted(int id, Pageable pageable);

    Page<Course> findByTitleContainingAndIsDeleted(String title, boolean isDeleted, Pageable pageable);

    Page<Course> findAll(Pageable pageable);

    @Query("SELECT NEW com.example.demo.dto.CourseStatisticDTO(c.id, c.title, c.thumbnail, c.price) FROM Course c WHERE MONTH(c.date) = :month AND YEAR(c.date) = :year")
    Page<CourseStatisticDTO> findCoursesCreatedInMonth(@Param("month") int month, @Param("year") int year, Pageable pageable);
}
