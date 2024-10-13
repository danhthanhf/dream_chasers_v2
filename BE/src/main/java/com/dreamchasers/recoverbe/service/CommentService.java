package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostService postService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final LessonService lessonService;

    public Comment getCommentFromCommentDTO(CommentDTO commentDTO) {
        var user = userService.findByEmail(commentDTO.getAuthor().getEmail());

        return Comment.builder()
                .content(commentDTO.getContent())
                .author(user)
                .replies(new ArrayList<>())
                .build();
    }

    public CommentDTO saveCommentToPost(CommentDTO commentDTO, UUID postId) throws Exception {
        if (commentDTO == null) {
            throw new IllegalArgumentException("CommentDTO cannot be null");
        }

        var author = userService.findByEmail(commentDTO.getAuthor().getEmail());
        User repliedUser = null;
        if(commentDTO.getRepliedUser() != null)
            repliedUser = userService.findByEmail(commentDTO.getRepliedUser().getEmail());

        if (author == null || (commentDTO.getRepliedUser() != null && repliedUser == null)) {
            System.out.println("saveComment: user not found");
            return null;
        }

        Comment comment = getCommentFromCommentDTO(commentDTO);

        if (postId != null) {
            var result = postService.saveComment(postId, comment);
            if (result == null)
                throw new Exception("Post not found");

            if(commentDTO.getParentId() != null) {
                var parentComment = commentRepository.findById(commentDTO.getParentId()).orElse(null);
                if (parentComment == null) {
                    throw new Exception("Parent comment not found");
                }

                if(parentComment.getParentComment() != null) {
                    parentComment.getParentComment().getReplies().add(comment);
                    comment.setParentComment(parentComment.getParentComment());
                }
                else {
                    parentComment.getReplies().add(comment);
                    comment.setParentComment(parentComment);
                }

                if(!Objects.equals(author.getEmail(), repliedUser.getEmail())) {
                    notificationService.saveAndSendToUser(author, repliedUser, "mention you in a comment", result.getTitle(), result.getTitle(), comment.getId());
                }
            }

            comment = commentRepository.save(comment);
        }

        commentDTO.setId(comment.getId());
        if(commentDTO.getParentId() != null)
            commentDTO.setParentId(comment.getParentComment().getId());
        commentDTO.setCreatedAt(LocalDateTime.now());
        commentDTO.setTotalReplies(comment.getReplies().size());
        System.out.println(commentDTO);
        return commentDTO;
    }

    public Comment getById(UUID id) {
        return commentRepository.findById(id).orElse(null);
    }


    public void deleteById(UUID id) {
        var comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ;
        }
        List<Comment> subComments = commentRepository.findAllByParentCommentId(id);

        if(!subComments.isEmpty()) {
            commentRepository.deleteAll(subComments);
        }
        commentRepository.delete(comment);
    }

}
