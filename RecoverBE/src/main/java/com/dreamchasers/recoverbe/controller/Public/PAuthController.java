package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.service.AuthService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class PAuthController {
    private final AuthService authService;

    @Autowired
    public PAuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseObject> register(@RequestBody com.dreamchasers.recoverbe.helper.Request.RegisterRequest request) {
        var result = authService.register(request);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody AuthenticationRequest request){
        var res = authService.authenticate(request);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PostMapping("/send-verify-email")
    public ResponseEntity<ResponseObject> sendVerifyEmail(@RequestBody AuthenticationRequest request) {
        var result = authService.sendCode(request.getEmail());
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/send-reset-password-email")
    public ResponseEntity<ResponseObject> sendResetPasswordEmail(@RequestBody AuthenticationRequest request) throws MessagingException {
        var result = authService.sendResetPasswordEmail(request.getEmail());
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseObject> resetPassword(@RequestBody AuthenticationRequest request) {
        var result = authService.resetPassword(request);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
