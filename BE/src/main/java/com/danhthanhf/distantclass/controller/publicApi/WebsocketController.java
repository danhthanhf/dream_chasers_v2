package com.danhthanhf.distantclass.controller.publicApi;

import com.danhthanhf.distantclass.dto.CommentDTO;
import com.danhthanhf.distantclass.dto.CommentDTOInCourse;
import com.danhthanhf.distantclass.dto.MessageDTO;
import com.danhthanhf.distantclass.service.ChatService;
import com.danhthanhf.distantclass.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebsocketController {
    public final CommentService commentService;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/posts/{postId}/comments")
    @SendTo("/posts/{postId}/comments")
    public Object handleCommentInPost(@Payload CommentDTO commentDTO, @DestinationVariable UUID postId) {
        return commentService.saveCommentToPost(commentDTO, postId);
    }

    @MessageMapping("/courses/{courseId}lessons/{lessonId}/comments")
    @SendTo("/lessons/{lessonId}/comments")
    public Object handleCommentInCourse(@Payload CommentDTOInCourse comment, @DestinationVariable UUID lessonId, @DestinationVariable UUID courseId) {
        return commentService.saveCommentToCourse(comment, courseId, lessonId);
    }

    @MessageMapping("/chats/{email}/messages")
    @SendTo("/user/{email}/chats")
    public Object handleChatMessage(@Payload MessageDTO message, @DestinationVariable String email) {
        return chatService.saveMessage(email, message);
    }

}
