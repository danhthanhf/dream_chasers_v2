package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.controller.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String greeting() {
        return "Hello, User!";
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseObject> resetPassword(@RequestBody AuthenticationRequest request) {
        var result = userService.resetPassword(request);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/delete/soft/{id}")
    public ResponseEntity<ResponseObject> softDelete(@PathVariable UUID id) {
        var result = userService.softDelete(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseObject> restoreUser(@PathVariable UUID id) {
        var result = userService.restoreUserById(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
