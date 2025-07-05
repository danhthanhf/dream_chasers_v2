package com.danhthanhf.distantclass.repository;

import com.danhthanhf.distantclass.entity.post.Post;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    Page<Post> findAllByDeletedAndStatus(boolean isDeleted, CoursePostStatus postStatus, @NonNull Pageable pageable);

    Page<Post> findAllByUserAndStatusAndDeleted(User user, CoursePostStatus status,boolean isDeleted, @NonNull Pageable pageable);

    Page<Post> findAllByDeleted(boolean isDeleted, @NonNull Pageable pageable);

    Post findByTitle(@NonNull String title);

    long countByStatusAndDeleted(CoursePostStatus postStatus, boolean isDeleted);

    @Query(value = "select * from post p where p.title like CONCAT('%', :title, '%') and p.status = :status and p.deleted = :isDeleted", nativeQuery = true)
    Page<Post> findAllByTitleAndStatusAndIsDeleted(String title, CoursePostStatus status, boolean isDeleted, Pageable pageable);

    @Query(value = "select * from post p where p.title like CONCAT('%', :title, '%') and p.deleted = :isDeleted", nativeQuery = true)
    Page<Post> findAllByTitleAndStatusAndDeleted(String title, boolean isDeleted, Pageable pageable);

}
