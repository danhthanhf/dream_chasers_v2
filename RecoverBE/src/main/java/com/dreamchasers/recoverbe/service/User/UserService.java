package com.dreamchasers.recoverbe.service.User;

import com.dreamchasers.recoverbe.controller.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.model.User.Role;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseObject resetPassword(AuthenticationRequest request) {
        var user = findUserByEmail(request.getEmail());
        if(user == null) return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).data(user).build();
    }

    public ResponseObject softDelete(UUID id) {
        var response = findUserById(id);
        if(response.getStatus() != HttpStatus.OK) {
            return response;
        }
        User user = (User) response.getData();
        if (Objects.equals(user.getRole(), Role.ADMIN) || user.getRole() == Role.MANAGER)
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Không thể xóa người dùng này").build();
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject restoreUserById(UUID id) {
        var response = findUserById(id);
        if(response.getStatus() != HttpStatus.OK) {
            return response;
        }
        User user = (User) response.getData();
        user.setDeleted(false);
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    private ResponseObject findUserById(UUID id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).data(user).build();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

}
