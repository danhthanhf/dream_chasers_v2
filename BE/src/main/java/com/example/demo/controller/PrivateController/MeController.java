package com.example.demo.controller.PrivateController;


import com.example.demo.auth.AuthService;
import com.example.demo.dto.*;
import com.example.demo.entity.data.MethodPayment;
import com.example.demo.entity.data.Post;
import com.example.demo.service.PostService;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/me")
public class MeController {
    private final PostService postService;
    private AuthService authService;
    private UserService userService;

    @Autowired
    public MeController(AuthService authService, UserService userService, PostService postService) {
        this.authService = authService;
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping("/{email}/posts/{id}")
    public ResponseEntity<ResponseObject> getPosts(@PathVariable String email,  @PathVariable int id) {
        var result = userService.getPostById(email, id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{email}/posts/bookmark")
    public ResponseEntity<ResponseObject> getBookmarks(@PathVariable String email) {
        var result = authService.getBookmarks(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{email}/courses")
    public ResponseEntity<ResponseObject> getCourses(@PathVariable String email) {
        var result = userService.getCourses(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{email}/posts")
    public ResponseEntity<ResponseObject> getPosts(@PathVariable String email,
            @RequestParam boolean deleted,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "5") int size) {
//        var result = userService.getPosts(email, deleted, page, size);
        var result = postService.getListPostOfUser(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/post/removeBookmark/{postId}")
    public ResponseEntity<ResponseObject> removeBookmark(@PathVariable String email, @PathVariable int postId) {
        var result = userService.toggleFavoritePost(email, postId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/post/favorite/{postId}")
    public ResponseEntity<ResponseObject> favoritePost(@PathVariable String email, @PathVariable int postId) {
        var result = userService.toggleFavoritePost(email, postId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/{email}/post/create")
    public ResponseEntity<ResponseObject> createPost(@RequestBody Post post, @PathVariable String email) {
        var result = userService.createPost(post, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/post/update")
    public ResponseEntity<ResponseObject> updatePost(@RequestBody Post post, @PathVariable String email) {
        var result = postService.updatePost(post, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


    @DeleteMapping("/{email}/comment/delete/{id}")
    public ResponseEntity<ResponseObject> DeleteComment(@PathVariable String email, @PathVariable int id) {
        var result = authService.deleteCommentById(email, id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/post/delete/{id}")
    public ResponseEntity<ResponseObject> DeletePost(@PathVariable String email, @PathVariable int id) {
        var result = postService.updateDeletePostOfUserById(email, id, true);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/post/restore/{id}")
    public ResponseEntity<ResponseObject> RestorePost(@PathVariable String email, @PathVariable int id) {
        var result = postService.updateDeletePostOfUserById(email, id, false);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/course/getAll/{email}")
    public ResponseEntity<ResponseObject> getAllCourse(@PathVariable String email) {
        var result = authService.getAllCourseByEmail(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{email}")
    public ResponseEntity<ResponseObject> getUsername(@PathVariable String email) {
        var result = authService.getUserByEmail(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseObject> updateProfile(@RequestPart(value = "user") UserDTO userDTO, @RequestParam(required = false) MultipartFile avatar) {
        var result = authService.updateProfile(userDTO, avatar);
        return ResponseEntity.status(result.getStatus()).body(result);

    }

    @PutMapping("/update/password")
    public ResponseEntity<ResponseObject> updatePassword(@RequestBody PasswordDTO passwordDTO) {
        var result = authService.updatePassword(passwordDTO);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/enroll/course")
    public ResponseEntity<ResponseObject> enrollCourse(@RequestBody EnrollDTO enrollDTO) {
        var result = authService.enrollCourse(enrollDTO);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{alias}/progress/{courseId}")
    public ResponseEntity<ResponseObject> getProgress(@PathVariable String alias, @PathVariable int courseId) {
        var result = authService.getProgressByCourseId(alias, courseId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{alias}/progress/{courseId}/updateLessonIds")
    public ResponseEntity<ResponseObject> updateLessonIds(@PathVariable String alias, @PathVariable int courseId
            , @RequestBody List<Integer> lessonIds) {
        var result = authService.updateLessonsIds(alias, courseId, lessonIds);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/{email}/notification/getAll")
    public ResponseEntity<ResponseObject> getAllNotification(@PathVariable String email, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = authService.getAllNotificationsByEmail(email, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/{email}/notification/removeAll")
    public ResponseEntity<ResponseObject> removeAllNotification(@PathVariable String email) {
        var result = authService.removeAllNotificationsByEmail(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/notification/read/{id}")
    public ResponseEntity<ResponseObject> readNotification(@PathVariable String email, @PathVariable int id) {
        var result = authService.readNotification(email, id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/notification/readAll")
    public ResponseEntity<ResponseObject> readAllNotification(@PathVariable String email) {
        var result = authService.readAllNotification(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/create_payment/{method}/{email}/{courseId}")
    public ResponseEntity<ResponseObject> getPay(@PathVariable String method, @PathVariable int courseId, @PathVariable String email) {
        var result = authService.getPayment(method, courseId, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/payment/process/{email}/{courseId}")
    public void processPayment(@PathVariable String email
            , @PathVariable int courseId
            , @RequestParam("vnp_Amount") String amount
            , @RequestParam("vnp_ResponseCode") String responseCode
            , @RequestParam("vnp_TransactionStatus") String transactionStatus, HttpServletResponse response) throws IOException {

        switch (transactionStatus) {
            case "00" -> {
                var result = authService.unLockCourse(email, courseId, MethodPayment.VNPAY);
                if (result.getStatus() == HttpStatus.BAD_REQUEST) {
                    response.sendRedirect("http://localhost:3000/payment/failure?status=" + transactionStatus + "&email=" + email + "&courseId=" + courseId + "&content=" + result.getContent());
                }
                response.sendRedirect("http://localhost:3000/payment/success?status=" + transactionStatus + "&email=" + email + "&courseId=" + courseId);
            }

            case "01", "02", "04", "05", "06", "07", "09" ->
                    response.sendRedirect("http://localhost:3000/payment/failure?status=" + transactionStatus + "&email=" + email + "&courseId=" + courseId);
        }
    }

}
