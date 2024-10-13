package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.Post.Post;
import com.dreamchasers.recoverbe.model.Post.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    Page<Post> findAllByDeletedAndStatus(boolean isDeleted, com.dreamchasers.recoverbe.model.Post.PostStatus postStatus, @NonNull Pageable pageable);

    Page<Post> findAllByDeleted(boolean isDeleted, @NonNull Pageable pageable);

    Post findByTitle(@NonNull String title);

    long countByStatusAndDeleted(PostStatus postStatus, boolean isDeleted);

    @Query(value = "select * from post p where p.title like CONCAT('%', :title, '%') and p.status = :status and p.deleted = :isDeleted", nativeQuery = true)
    Page<Post> findAllByTitleAndStatusAndIsDeleted(String title, com.dreamchasers.recoverbe.model.Post.PostStatus status, boolean isDeleted, Pageable pageable);

    @Query(value = "select * from post p where p.title like CONCAT('%', :title, '%') and p.deleted = :isDeleted", nativeQuery = true)
    Page<Post> findAllByTitleAndStatusAndDeleted(String title, boolean isDeleted, Pageable pageable);

}
