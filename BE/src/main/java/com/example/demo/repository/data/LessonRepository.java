package com.example.demo.repository.data;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    @Query(value = "UPDATE Lesson l SET l.isDeleted = :isDeleted WHERE l.section_id in :sectionIds", nativeQuery = true)
    void markLessonsAsDeleted(List<Integer> sectionIds, boolean isDeleted);

    @Query(value = "select * from lesson l inner join sections s on l.section_id = s.id inner join course c on c.id = s.course_id where s.course_id = :courseId", nativeQuery = true)
    List<Lesson> findAllByCourseId(int courseId);
}
