package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.User.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {


    @Query(value = "select * from comment c left join  post_comments pc on c.id = pc.comments_id where pc.post_id = :postId and c.parent_id is :parentId and c.deleted = 0 ORDER BY created_at DESC", nativeQuery = true)
    Page<Comment> findAllByPostIdAndParentCommentIdOrderByCreatedAt(UUID postId, UUID parentId, Pageable pageable);


    List<Comment> findAllByParentCommentId(UUID parentId);

    @Query(value = "select count(pc.comments_id) \n" +
            "from post_comments pc join post p  on p.id = pc.post_id\n" +
            "join comment c on c.id = pc.comments_id\n" +
            "where c.parent_id is null and p.id = :postId", nativeQuery = true)
    int countTotalMainComment(UUID postId);

    List<Comment> findAllByParentCommentIdOrderByCreatedAt(UUID parentId);
}
