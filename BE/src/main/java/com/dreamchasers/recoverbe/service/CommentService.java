package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.entity.User.Comment;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.NotificationType;
import com.dreamchasers.recoverbe.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
            var post = postService.saveComment(postId, comment);
            if (post == null)
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
                    notificationService.sendNotificationToUser(author, repliedUser, comment.getId(), NotificationType.COMMENT_REPLY, post.getTitle(), "mention you in a comment", null);
                }
            }
            notificationService.sendNotificationToUser(author, repliedUser, null, NotificationType.POST_COMMENT, post.getTitle(),"commented on your post", null);

            comment = commentRepository.save(comment);
        }

        commentDTO.setId(comment.getId());
        if(commentDTO.getParentId() != null)
            commentDTO.setParentId(comment.getParentComment().getId());
        commentDTO.setCreatedAt(LocalDateTime.now());
        commentDTO.setTotalReplies(comment.getReplies().size());
        return commentDTO;
    }

    public Comment getById(UUID id) {
        return commentRepository.findById(id).orElse(null);
    }

}
