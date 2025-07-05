package com.danhthanhf.distantclass.controller.publicApi;

import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
