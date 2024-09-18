package com.example.demo.controller.PrivateController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/private/post")
public class PostController {
    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> searchPost(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "5") int size,
                                                 @RequestParam(defaultValue = "APPROVED") String status,
                                                 @RequestParam String title) {
        var result = postService.getPostsByTitleAndStatus(title, status, page, size);

        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "5") int size,
                                                 @RequestParam(defaultValue = "ALL") String status) {
        var result = postService.getAll(status, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<ResponseObject> updateStatus(@PathVariable int id, @PathVariable String status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = postService.updateStatus(id, status, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
