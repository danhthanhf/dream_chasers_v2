package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/me")
public class MeController {
    private final UserService userService;

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
