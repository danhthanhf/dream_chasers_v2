package com.example.demo.controller.PublicController;

import com.example.demo.dto.CommentDTO;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Notification;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;


    @MessageMapping("/comment/lesson/{lessonId}")
    @SendTo("/comment/lesson/{lessonId}")
    public Comment handleComment(@Payload CommentDTO commentDTO, @DestinationVariable int lessonId) throws Exception {
        return commentService.saveComment(commentDTO);
    }

    @MessageMapping("/comment/post/{postId}")
    @SendTo("/comment/post/{postId}")
    public Comment handleCommentPost(@Payload CommentDTO commentDTO, @DestinationVariable int postId) throws Exception {
        return commentService.saveComment(commentDTO);
    }

}
