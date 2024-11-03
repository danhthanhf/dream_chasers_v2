package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.dto.UserDTO;
import com.dreamchasers.recoverbe.enums.MethodPayment;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.entity.Post.Post;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.service.CourseService;
import com.dreamchasers.recoverbe.service.PostService;
import com.dreamchasers.recoverbe.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/me")
public class MeController {
    private final UserService userService;
    private final PostService postService;


    @GetMapping("/create-payment")
    public ResponseEntity<ResponseObject> getPay(@RequestParam String method, @RequestParam UUID courseId) {
        var result = userService.getPayment(method, courseId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/posts")
    public ResponseEntity<ResponseObject> getPostList(@RequestParam CoursePostStatus status, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size)
    {
        var result = postService.getPostListByUser(status, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/courses/{title}")
    public ResponseEntity<ResponseObject> checkEnrollment(@PathVariable String title) {
        var result = userService.checkEnrollment(title);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

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

    @PutMapping("post/change-status/{postId}")
    public ResponseEntity<ResponseObject> changePostStatus(@PathVariable UUID postId, @RequestBody CoursePostStatus status) {
        var result = postService.userChangeStatus(postId, status);
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

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<ResponseObject> enrollCourse(@PathVariable UUID courseId) {
        var result = userService.enrollCourse(courseId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/{email}/post/create")
    public ResponseEntity<ResponseObject> createPost(@RequestBody Post post, @PathVariable String email) {
        System.out.println(post);
        var result = postService.createPost(post, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/posts/update/{postId}")
    public ResponseEntity<ResponseObject> updatePost(@RequestBody Post post, @PathVariable UUID postId) {
        var result = postService.updatePost(postId, post);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


}
