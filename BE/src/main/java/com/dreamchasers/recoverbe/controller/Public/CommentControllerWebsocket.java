package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class CommentControllerWebsocket {
    public final CommentService commentService;

    @MessageMapping("/comment/post/{postId}")
    @SendTo("/comment/post/{postId}")
    public Object handleCommentInPost(@Payload CommentDTO commentDTO, @DestinationVariable UUID postId) throws Exception {
            return commentService.saveCommentToPost(commentDTO, postId);
    }
}
