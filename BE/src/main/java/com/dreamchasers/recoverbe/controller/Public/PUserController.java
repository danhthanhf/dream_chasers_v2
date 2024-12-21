package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequestMapping("/api/v1/public/users")
@RestController
@RequiredArgsConstructor
public class PUserController {
    private final UserService userService;

    @GetMapping("/{email}/profile")
    public ResponseEntity<ResponseObject> getUserProfile(@PathVariable String email, @RequestParam String type) {
        var res = userService.getUserProfile(email, type);
        return ResponseEntity.status(res.getStatus()).body(res);
    }
}
