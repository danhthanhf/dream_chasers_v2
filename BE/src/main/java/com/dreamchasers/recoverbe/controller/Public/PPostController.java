package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/post")
@RequiredArgsConstructor
public class PPostController {
    private final PostService postService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getByTitle(@RequestParam String title, @RequestParam(required = false) UUID watch, @RequestParam(required = false, defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "5") int size) {
        var result = postService.getByTitle(title, watch, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/list")
    public ResponseEntity<ResponseObject> getList(@RequestParam int page, @RequestParam int size) {
        var result = postService.getPosts(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{id}/add-view")
    public ResponseEntity<ResponseObject> addView(@PathVariable UUID id) {
        var result = postService.addView(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ResponseObject> getComments(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        var result = postService.getMoreComments(id, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
