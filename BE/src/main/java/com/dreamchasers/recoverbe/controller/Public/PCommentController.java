package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/comments")
@RequiredArgsConstructor
public class PCommentController {
    private final CommentService commentService;
    @GetMapping("{id}")
    public ResponseEntity<ResponseObject> getCommentById(@PathVariable UUID id) {
        var res = commentService.getCommentById(id);
        return ResponseEntity.status(res.getStatus()).body(res);

    }
}
