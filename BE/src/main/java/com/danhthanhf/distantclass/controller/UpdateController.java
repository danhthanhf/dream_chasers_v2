package com.dreamchasers.danhthanhf.distantclass.controller;

import com.dreamchasers.danhthanhf.distantclass.service.EnrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/update")
@RestController
@RequiredArgsConstructor
public class UpdateController {
    private final EnrollService enrollService;
    @PostMapping("/add-friend-instructors")
    public ResponseEntity<Void> addFriends() {
        enrollService.updateFriendsForUserEnrolledCourse();
        return ResponseEntity.ok().build();
    }
}
