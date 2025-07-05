package com.danhthanhf.distantclass.controller.User;

import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;


    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "all") String type, @RequestParam int page, @RequestParam int size) {
        var result = notificationService.getAll(type, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAllUnread")
    public ResponseEntity<ResponseObject> getAllUnread(@RequestParam int page, @RequestParam int size) {
        var result = notificationService.getAllUnread(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/readAll")
    public ResponseEntity<ResponseObject> readAllNotification() {
        var result = notificationService.readAllNotification();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/removeAll")
    public ResponseEntity<ResponseObject> removeAllNotification() {
        var result = notificationService.removeAllNotificationsByEmail();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ResponseObject> readNotification(@PathVariable UUID id) {
        var result = notificationService.readNotification(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
