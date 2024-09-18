package com.example.demo.repository.data;

import com.example.demo.dto.PostDTO;
import com.example.demo.entity.data.Post;
import com.example.demo.entity.data.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.security.core.parameters.P;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Page<Post> findAllByIsDeletedAndStatus(boolean isDeleted, PostStatus postStatus, @NonNull Pageable pageable);

    Page<Post> findAllByIsDeleted(boolean isDeleted, @NonNull Pageable pageable);

    Post findByTitle(@NonNull String title);

    long countByStatusAndIsDeleted(PostStatus postStatus, boolean isDeleted);

    @Query(value = "select * from post p where p.title like CONCAT('%', :title, '%') and p.status = :status and p.is_deleted = :isDeleted", nativeQuery = true)
    Page<Post> findAllByTitleAndStatusAndIsDeleted(String title, PostStatus status, boolean isDeleted, Pageable pageable);

    @Query(value = "select * from post p where p.title like CONCAT('%', :title, '%') and p.is_deleted = :isDeleted", nativeQuery = true)
    Page<Post> findAllByTitleAndStatusAndIsDeleted(String title, boolean isDeleted, Pageable pageable);

    Page<Post> findByUserEmailAndAndIsDeleted(String email, boolean deleted,  Pageable pageable);
}
