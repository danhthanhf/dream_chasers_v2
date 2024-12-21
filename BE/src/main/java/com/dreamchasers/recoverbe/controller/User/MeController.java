package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.dto.CommentDTOInCourse;
import com.dreamchasers.recoverbe.dto.UserDTO;
import com.dreamchasers.recoverbe.entity.CourseKit.Rating;
import com.dreamchasers.recoverbe.entity.User.Note;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.entity.post.Post;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final NoteService noteService;
    private final RequestService requestService;
    private final NotificationService notificationService;

    @GetMapping("/search-friend")
    public ResponseEntity<ResponseObject> searchContact(@RequestParam String name) {
        var result = userService.searchContact(name);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/profile")
    public ResponseEntity<ResponseObject> getProfile() {
        var result = userService.getProfile();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/notes/{lessonId}")
    public ResponseEntity<ResponseObject> getNoteById(@PathVariable UUID lessonId, @RequestParam int time) {
        var res = noteService.getByTime(lessonId, time);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @GetMapping("/notes")
    public ResponseEntity<ResponseObject> getAllFilter(@RequestParam UUID courseId, @RequestParam(required = false) UUID lessonId, @RequestParam String order, @RequestParam int page, @RequestParam int size) {
        var res = noteService.getAllFilter(courseId, lessonId, order, page, size);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<ResponseObject> updateNote(@RequestBody Note note, @PathVariable UUID id) {
        var res = noteService.update(id, note);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<ResponseObject> deleteById(@PathVariable UUID id) {
        noteService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/courses/enrolled")
    public ResponseEntity<ResponseObject> getMyLearning(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = userService.getEnrolledCourse(0, 99);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/courses/{courseId}/enrollment")
    public ResponseEntity<ResponseObject> getProgress(@PathVariable UUID courseId) {
        var result = userService.getProgress(courseId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/create-payment")
    public ResponseEntity<ResponseObject> getPay(@RequestParam String method, @RequestParam UUID courseId) {
        var result = userService.getPayment(method, courseId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/posts")
    public ResponseEntity<ResponseObject> getPostList(@RequestParam CoursePostStatus status, @RequestParam boolean deleted, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size)
    {
        var result = postService.getPostListByUser(status, deleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/courses/{id}/check-enrollment")
    public ResponseEntity<ResponseObject> checkEnrollment(@PathVariable UUID id) {
        var result = userService.checkEnrollment(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/instructor/register")
    public ResponseEntity<ResponseObject> registerInstructor() {
        var result = requestService.sendRegisterInstructor();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/{email}/add-friend")
    public ResponseEntity<ResponseObject> addFriend(@PathVariable String email) {
        var res = notificationService.addFriend(email);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ResponseObject> updateComment(@PathVariable UUID commentId, @RequestBody CommentDTO comment) {
        var result = userService.updateComment(comment);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/notes/{courseId}/{lessonId}")
    public ResponseEntity<ResponseObject> save(@PathVariable UUID courseId, @PathVariable UUID lessonId, @RequestBody Note note) {
        var res = noteService.save(courseId, lessonId, note);
        return ResponseEntity.status(res.getStatus()).body(res);
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

    @PutMapping("/courses/{courseId}/lessons/{lessonId}/completed")
    public ResponseEntity<ResponseObject> completedLesson(@PathVariable UUID courseId, @PathVariable UUID lessonId) {
        var result = userService.completedLesson(courseId, lessonId);
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

    @PutMapping("/posts/update/{postId}")
    public ResponseEntity<ResponseObject> updatePost(@RequestBody Post post, @PathVariable UUID postId) {
        var result = postService.updatePost(postId, post);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/courses/{courseId}/rating")
    public ResponseEntity<ResponseObject> rateCourse(@PathVariable UUID courseId, @RequestBody Rating rating) {
        var result = userService.rateCourse(courseId, rating);
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

    @PostMapping("/comments/{courseId}/{lessonId}")
    public ResponseEntity<ResponseObject> commentCourse(@PathVariable UUID courseId, @PathVariable UUID lessonId, @RequestBody CommentDTOInCourse ask) {
        var res = userService.commentCourse(courseId, lessonId, ask);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @DeleteMapping("/comments/{commentId}/post/{postId}")
    public ResponseEntity<ResponseObject> deleteCommentInPost(@PathVariable UUID commentId, @PathVariable UUID postId) {
        var result = userService.deleteComment(commentId, "post", postId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/comments/{commentId}/lesson/{lessonId}")
    public ResponseEntity<ResponseObject> deleteCommentInLesson(@PathVariable UUID commentId, @PathVariable UUID lessonId) {
        var result = userService.deleteComment(commentId, "lesson", lessonId);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

//    @PostMapping("/comments/{commentId}/follow")
//    public ResponseEntity<ResponseObject> followComment(@PathVariable UUID commentId) {
//        var result = userService.followComment(commentId);
//        return ResponseEntity.status(result.getStatus()).body(result);
//    }
//
//    @PutMapping("/comments/{commentId}/un-follow")
//    public ResponseEntity<ResponseObject> unFollowComment(@PathVariable UUID commentId) {
//        var result = userService.unFollowComment(commentId);
//        return ResponseEntity.status(result.getStatus()).body(result);
//    }
}
