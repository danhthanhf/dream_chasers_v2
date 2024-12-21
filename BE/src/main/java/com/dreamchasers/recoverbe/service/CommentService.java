package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.dto.CommentDTOInCourse;
import com.dreamchasers.recoverbe.entity.User.Comment;
import com.dreamchasers.recoverbe.entity.User.Notification;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.entity.chat.Message;
import com.dreamchasers.recoverbe.entity.post.Post;
import com.dreamchasers.recoverbe.enums.NotificationType;
import com.dreamchasers.recoverbe.enums.ReferenceType;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.converters.ConvertService;
import com.dreamchasers.recoverbe.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final ConvertService convertService;

    public void saveCommentToChat(UUID chatId, Message message) {

    }

    public ResponseObject getCommentById(UUID id) {
        var comment = commentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Comment not found"));
        return ResponseObject.builder().status(HttpStatus.OK).content(comment).build();
    }

    public Comment getCommentFromCommentDTO(CommentDTO commentDTO) {
        var user = userService.findByEmail(commentDTO.getAuthor().getEmail());

        return Comment.builder()
                .content(commentDTO.getContent())
                .author(user)
                .replies(new ArrayList<>())
                .build();
    }

    private Comment getCommentFromCommentDTOInCourse(CommentDTOInCourse commentDTO) {
        var user = userService.findByEmail(commentDTO.getAuthor().getEmail());

        return Comment.builder()
                .title(commentDTO.getTitle())
                .lessonId(commentDTO.getLessonId())
                .courseId(commentDTO.getCourseId())
                .content(commentDTO.getContent())
                .author(user)
                .replies(new ArrayList<>())
                .build();
    }


    private Comment setParentCommentAndSave(CommentDTO commentDTO, Comment comment) {
        if(commentDTO.getParentId() != null) {
            var parentComment = commentRepository.findById(commentDTO.getParentId()).orElseThrow(() -> new EntityNotFoundException("Parent comment not found"));
            if(parentComment.getRepliedUser() != null && !Objects.equals(commentDTO.getRepliedUser().getEmail(), commentDTO.getAuthor().getEmail())) {
                comment.setRepliedUser(parentComment.getAuthor());
            }

            if(parentComment.getParentComment() != null) {
                parentComment.getParentComment().getReplies().add(comment);
                comment.setParentComment(parentComment.getParentComment());
            }
            else {
                parentComment.getReplies().add(comment);
                comment.setParentComment(parentComment);
            }
        }
       return commentRepository.save(comment);
    }

    private void sendNotificationToAuthorComment(Notification notification) {
        if(notification.getRecipient() != null && !Objects.equals(notification.getSender().getEmail(), notification.getRecipient().getEmail())) {
            notificationService.sendNotificationToUser(notification);
        }
    }

    public CommentDTO saveCommentToCourse(CommentDTOInCourse commentDTO,UUID courseId, UUID lessonId) {
        if (commentDTO == null || lessonId == null || commentDTO.getContent().isEmpty()) {
            throw new EntityNotFoundException("Entity cannot be null");
        }

        var author = userService.findByEmail(commentDTO.getAuthor().getEmail());
        User repliedUser = null;

        if(commentDTO.getRepliedUser() != null)
            repliedUser = userService.findByEmail(commentDTO.getRepliedUser().getEmail());

        if (author == null || (commentDTO.getRepliedUser() != null && repliedUser == null)) {
            return null;
        }

        Comment comment = getCommentFromCommentDTOInCourse(commentDTO);


        comment = setParentCommentAndSave(commentDTO, comment);

        commentDTO.setId(comment.getId());
        var lesson = lessonService.saveComment(lessonId, comment);

        if(repliedUser != null)
        {
            var noti = Notification.builder()
                            .courseId(courseId)
                    .lessonId(lessonId)
                    .commentId(comment.getId())
                    .referenceType(ReferenceType.COURSE)
                    .title(lesson.getTitle())
                    .sender(author)
                    .recipient(repliedUser)
                    .type(NotificationType.COMMENT_REPLY)
                    .build();
            sendNotificationToAuthorComment(noti);

        }

        if(commentDTO.getParentId() != null)
            commentDTO.setParentId(comment.getParentComment().getId());
        commentDTO.setCreatedAt(LocalDateTime.now());
        commentDTO.setTotalReplies(comment.getReplies().size());
        commentDTO.setRepliedUser(convertService.convertToUserBasicDTO(comment.getRepliedUser()));
        return commentDTO;
    }

    public CommentDTO saveCommentToPost(CommentDTO commentDTO, UUID postId) {
        if (commentDTO == null) {
            throw new IllegalArgumentException("CommentDTO cannot be null");
        }
        Post post;
        var author = userService.findByEmail(commentDTO.getAuthor().getEmail());
        User repliedUser = null;

        if(commentDTO.getRepliedUser() != null)
            repliedUser = userService.findByEmail(commentDTO.getRepliedUser().getEmail());

        if (author == null || (commentDTO.getRepliedUser() != null && repliedUser == null)) {
            return null;
        }

        Comment comment = getCommentFromCommentDTO(commentDTO);

        if (postId != null) {
            post = postService.saveComment(postId, comment);
            if (post == null)
                throw new EntityNotFoundException("Post not found");

            comment = setParentCommentAndSave(commentDTO, comment);
            commentDTO.setId(comment.getId());

            // send notification to post author
            notificationService.sendToPostAuthor(comment.getAuthor(), post.getUser(), ReferenceType.POST, comment.getId(), post.getTitle());

            if(repliedUser != null){
                var noti = Notification.builder()
                        .postTitle(post.getTitle())
                        .commentId(comment.getId())
                        .referenceType(ReferenceType.POST)
                        .title(post.getTitle())
                        .sender(author)
                        .content("replied to your comment")
                        .recipient(repliedUser)
                        .type(NotificationType.COMMENT_REPLY)
                        .build();
                // send notification to author comment
                sendNotificationToAuthorComment(noti);
            }

        }

        if(commentDTO.getParentId() != null)
            commentDTO.setParentId(comment.getParentComment().getId());

        commentDTO.setCreatedAt(LocalDateTime.now());
        commentDTO.setTotalReplies(comment.getReplies().size());

        return commentDTO;
    }


}
