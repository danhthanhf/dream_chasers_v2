package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/me/notification")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/{email}/getAll")
    public ResponseEntity<ResponseObject> getAll(@PathVariable String email, @RequestParam int page, @RequestParam int size) {
        var result = notificationService.getAll(email, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("{email}/getAllUnread")
    public ResponseEntity<ResponseObject> getAllUnread(@PathVariable String email, @RequestParam int page, @RequestParam int size) {
        var result = notificationService.getAllUnread(email, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/readAll")
    public ResponseEntity<ResponseObject> readAllNotification(@PathVariable String email) {
        var result = notificationService.readAllNotification(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/{email}/removeAll")
    public ResponseEntity<ResponseObject> removeAllNotification(@PathVariable String email) {
        var result = notificationService.removeAllNotificationsByEmail(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{email}/read/{id}")
    public ResponseEntity<ResponseObject> readNotification(@PathVariable String email, @PathVariable UUID id) {
        var result = notificationService.readNotification(email, id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
