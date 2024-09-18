package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Notification;
import com.example.demo.entity.data.Post;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CommentRepository;
import com.example.demo.repository.data.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  CommentRepository commentRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private PostService postService;
    @Autowired
    private LessonService lessonService;
    @Autowired
    private NotificationService notificationService;


    public ResponseObject getComments(int id, int page, int size) {
        var post = postService.findById(id);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).mess("Post not found").build();
        }
        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .content(getCommentsByPostId(id, page, size))
                .build();
    }

    public Comment getById(int id) {
        return commentRepository.findById(id).orElse(null);
    }

    public Page<Comment> getCommentsByPostId(int postId, int page, int size) {
        return commentRepository.findAllByPostId(postId, PageRequest.of(page, size));
    }

    public void deleteById(int id) {
        var comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ;
        }
        List<Comment> subComments = commentRepository.findAllByParentId(id);

        if(!subComments.isEmpty()) {
            for (Comment subComment : subComments) {
                subComment.getUser().getComments().remove(subComment);
                commentRepository.delete(subComment);
            }
        }
        commentRepository.delete(comment);
    }


    public Comment saveComment(CommentDTO commentDTO) throws Exception {
        if (commentDTO == null) {
            throw new IllegalArgumentException("CommentDTO cannot be null");
        }

        var user = userRepository.findByEmail(commentDTO.getEmail()).orElse(null);
        if (user == null) {
            System.out.println("saveComment: user not found");
            return null;
        }

        Comment comment = Comment.builder()
                .userEmail(commentDTO.getEmail())
                .userName(commentDTO.getUserName())
                .avatar(commentDTO.getAvatar())
                .user(user)
                .content(commentDTO.getContent())
                .parentId(commentDTO.getParentId())
                .date(LocalDateTime.now())
                .replyToUser(commentDTO.getReplyToUser())
                .replyToUserName(commentDTO.getReplyToUserName())
                .build();

        if(commentDTO.getLessonId() != 0) {
           var result = lessonService.saveComment(commentDTO.getLessonId(), comment);
           if (!result)
                throw new Exception("Lesson not found");

        }
        else if (commentDTO.getPostId() != 0) {
            var result = postService.saveComment(commentDTO.getPostId(), comment);
            if (!result)
                throw new Exception("Post not found");
            postService.sendNotificationToPostUser(commentDTO, commentDTO.getPostId());
        }
        notificationService.sendNotificationToUser(commentDTO, commentDTO.getReplyToUser(), "Mentioned you in a comment");
        return commentRepository.save(comment);
    }


    public ResponseObject getCommentByLessonId(int lessonId, int page, int size) {
        var comments = commentRepository.findAllByLessonId(lessonId, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(comments).build();
    }
}
