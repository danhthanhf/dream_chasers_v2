package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.dto.ResetPasswordDTO;
import com.dreamchasers.recoverbe.helper.Request.RegisterRequest;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.AuthService;
import com.dreamchasers.recoverbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/private/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthService authService;


    @GetMapping("/getAllUserAndRole")
    public ResponseEntity<ResponseObject> getAllRole(@RequestParam(defaultValue = "false") boolean isDeleted, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = userService.getAllUserAndRole(isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("")
    public ResponseEntity<ResponseObject> greeting() {
        var res = ResponseObject.builder().status(HttpStatus.OK).message("Welcome to admin dashboard").build();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = userService.getAll(false, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAllDeleted")
    public ResponseEntity<ResponseObject> getAllDeleted(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = userService.getAll(true, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/filter")
    public ResponseEntity<ResponseObject> getUserByRole(@RequestParam(value = "role") String role,
                                                        @RequestParam boolean isDeleted,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size) {
        var result = userService.getUserByRole(role, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/view")
    public ResponseEntity<ResponseObject> getUserByName(@RequestParam String email) {
        var result = userService.getUserByEmail(email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseObject> getUserByNameAndEmail(@RequestParam(value = "name") String name, @RequestParam String role, @RequestParam(defaultValue = "false") boolean isDeleted,
                                                                @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = userService.getUserByNameAndEmail(name, role, isDeleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createUser(@RequestBody RegisterRequest request) {
        var result = authService.register(request);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/resetPassword/{email}")
    public ResponseEntity<ResponseObject> resetPassword(@RequestBody ResetPasswordDTO passwordDTO, @PathVariable String email) {
        var result = userService.adminUpdatePasswordForUser(passwordDTO, email);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/delete/soft/{id}")
    public ResponseEntity<ResponseObject> softDelete(@PathVariable UUID id) {
        var result = userService.softDelete(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/delete/soft/list")
    public ResponseEntity<ResponseObject> softDeleteUsers(@RequestParam List<UUID> ids) {
        var result = userService.softDeleteListUser(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/restore/list")
    public ResponseEntity<ResponseObject> restoreUsers(@RequestParam List<UUID> ids) {
        var result = userService.restoreListUser(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/restore/{id}")
    public ResponseEntity<ResponseObject> restoreUser(@PathVariable UUID id) {
        var result = userService.restoreUserById(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
