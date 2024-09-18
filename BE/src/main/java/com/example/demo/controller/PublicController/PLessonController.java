package com.example.demo.controller.PublicController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.repository.data.LessonRepository;
import com.example.demo.service.CommentService;
import com.example.demo.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/lesson")
@RequiredArgsConstructor
public class PLessonController {
    private final LessonRepository lessonRepository;
    private final LessonService lessonService;
    private final CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable  int id) {
        var result = lessonService.getById(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ResponseObject> getComments(@PathVariable  int id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = commentService.getCommentByLessonId(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}