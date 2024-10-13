package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.dto.UserDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.model.Post.Post;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.service.PostService;
import com.dreamchasers.recoverbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/me")
public class MeController {
    private final UserService userService;
    private final PostService postService;

    @PostMapping("/upload-avatar")
    public ResponseEntity<ResponseObject> uploadAvatar(@RequestPart ("avatar") MultipartFile avatar) {
        var result = userService.uploadAvatar(avatar);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseObject> logout(String email) {
        System.out.println("logout");
        var result = userService.logout(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseObject> resetPassword(@RequestBody AuthenticationRequest request) {
        var result = userService.resetPassword(request);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseObject> updateProfile(@RequestBody UserDTO userDTO) {
        var result = userService.updateProfile(userDTO);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/post/like/{postId}")
    public ResponseEntity<ResponseObject> likePost(@PathVariable String email, @PathVariable UUID postId) {
        var result = postService.likePost(postId, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/{email}/post/create")
    public ResponseEntity<ResponseObject> createPost(@RequestBody Post post, @PathVariable String email) {
        System.out.println(post);
        var result = postService.createPost(post, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/{email}/post/{postId}/like")
    public ResponseEntity<ResponseObject> likePost(@RequestParam UUID postId, @RequestParam String email) {
        var result = postService.likePost(postId, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


}
