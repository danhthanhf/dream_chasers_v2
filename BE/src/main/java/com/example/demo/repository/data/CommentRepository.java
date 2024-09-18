package com.example.demo.repository.data;

import com.example.demo.dto.CommentDTO;
import com.example.demo.entity.data.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    @Query(value = "SELECT * FROM comment c left join lesson_comments lc on c.id = lc.comments_id where lc.lesson_id = :lessonId  ORDER BY date DESC", nativeQuery = true)
    Page<Comment> findAllByLessonId(int lessonId, Pageable pageable);

    @Query(value = "select * from comment c left join  post_comments pc on c.id = pc.comments_id where pc.post_id = :postId ORDER BY date DESC", nativeQuery = true)
    Page<Comment> findAllByPostId(int postId, Pageable pageable);

    List<Comment> findAllByParentId(int parentId);
}
