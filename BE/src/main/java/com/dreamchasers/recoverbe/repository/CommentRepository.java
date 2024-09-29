package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.User.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
}
