package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.entity.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    @Query(value = "SELECT rating, COUNT(*) AS rating_count " +
            "FROM rating " +
            "WHERE course_id = :courseId " +
            "GROUP BY rating " +
            "ORDER BY rating DESC", nativeQuery = true)
    List<Map<Integer, Integer>> countRating(@Param("courseId") UUID courseId);

    Page<Course> findAllByAuthorAndStatusAndDeleted(User author, CoursePostStatus status, boolean deleted, Pageable pageable);

    Page<Course> findAllByCategoriesIdAndAuthorAndDeleted(UUID id, User author, boolean deleted, Pageable pageable);

    Page<Course> findAllByCategoriesIdAndStatusAndAuthorAndDeleted(UUID id, CoursePostStatus status, User author, boolean deleted, Pageable pageable);

    Page<Course> findAllByStatusIn(List<CoursePostStatus> statuses, Pageable pageable);

    Page<Course> findAllByStatusInAndDeletedAndAuthor(List<CoursePostStatus> status,boolean deleted, User author, Pageable pageable);

    Page<Course> findAllByCategoriesIdAndStatusInAndDeletedAndAuthor(UUID id, List<CoursePostStatus> status,boolean deleted, User author, Pageable pageable);

    Page<Course> findByTitleContainingAndCategoriesIdAndDeleted(String title, UUID categoryId, boolean isDeleted, Pageable pageable);

    Page<Course> findByAuthorAndStatusInAndTitleContainingAndCategoriesIdAndDeleted(User author, List<CoursePostStatus> status, String title, UUID categoryId, boolean isDeleted, Pageable pageable);

    Page<Course> findByTitleContainingAndDeleted(String title, boolean isDeleted, Pageable pageable);

    Page<Course> findByAuthorAndTitleContainingAndStatusInAndDeleted(User author, String title, List<CoursePostStatus> status, boolean isDeleted, Pageable pageable);

    Optional<Course> findByTitle(String title);

    Page<Course> findAllByDeleted(boolean isDeleted, Pageable pageable);

    Page<Course> findAllByAuthorAndDeleted(User author, boolean isDeleted, Pageable pageable);

    Page<Course> findAllByStatusAndDeleted(CoursePostStatus isPublic, boolean isDeleted, Pageable pageable);

    Page<Course> findAllByCategoriesIdAndDeleted(UUID id, boolean deleted, Pageable pageable);

    Page<Course> findAllByCategoriesIdAndStatusAndDeleted(UUID id, CoursePostStatus status, boolean deleted, Pageable pageable);

}
