package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.ResetPasswordDTO;
import com.dreamchasers.recoverbe.dto.UserAndRoleDTO;
import com.dreamchasers.recoverbe.dto.UserDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.jwt.JwtService;
import com.dreamchasers.recoverbe.model.User.Role;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Transient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CloudinaryService cloudinaryService;

    public ResponseObject softDeleteListUser(List<UUID> ids) {
        var users = ids.stream().map(id -> userRepository.findById(id).orElse(null)).toList();
        ResponseObject[] res = new ResponseObject[1];
        users.forEach(user -> {
            if (user != null) {
                if(Objects.equals(user.getRole(), Role.ADMIN) || user.getRole() == Role.MANAGER) {
                    res[0] =  ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Cannot delete ADMIN or MANAGER.").build();
                    return;
                }
                user.setDeleted(true);
            }
        });
        if(res[0] != null) {
            return res[0];
        }
        userRepository.saveAll(users);
        return res[0];
    }

    public ResponseObject uploadAvatar(MultipartFile file) {
        try {
            var url = cloudinaryService.uploadFile(file).get();
            return ResponseObject.builder().status(HttpStatus.OK).content(url).build();
        } catch (Exception e) {
            log.error("uploadAvatar: " + e.getMessage());
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Error occurred when uploading avatar").build();
        }
    }

    public ResponseObject updateProfile(UserDTO userDTO)  {
        var user = userRepository.findByEmail(userDTO.getEmail()).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Username not found").build();
        }
        user.setAvatarUrl(userDTO.getAvatarUrl());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).content(user).build();
    }

    public ResponseObject getAllUserAndRole(boolean isDeleted, int page, int size){
        var roles = Role.values();
        var users = userRepository.findAllByDeleted(isDeleted, PageRequest.of(page, size));
        UserAndRoleDTO usersAndRoles = UserAndRoleDTO.builder().roles(roles).users(users).build();
        return ResponseObject.builder().status(HttpStatus.OK).content(usersAndRoles).build();
    }

    public ResponseObject getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseObject.builder().status(HttpStatus.OK).content(user).build())
                .orElse(ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("User not found!").build());
    }

    public ResponseObject getUserByNameAndEmail(String name, String role, boolean isDelete, int page, int size) {
        Page<User> users;
        if (Objects.equals(name, "")) {
            if(Objects.equals(role.toLowerCase(), "all"))
                users = userRepository.findAllByDeleted(isDelete, PageRequest.of(page, size));
            else {
                Role role1 = Role.valueOf(role);
                users = userRepository.findByRoleAndDeleted(role1, isDelete, PageRequest.of(page, size));
            }
        }
        else {
            if(Objects.equals(role.toLowerCase(), "all"))
                users = userRepository.findByFirstNameContainingOrLastNameContainingOrEmailContainingAndDeleted(name, name, name, isDelete, PageRequest.of(page, size));

            else {
                Role role1 = Role.valueOf(role);
                users = userRepository.findByFirstNameContainingOrLastNameContainingOrEmailContainingAndDeletedAndRole(name, name, name,isDelete, role1, PageRequest.of(page, size));

            }
        }
        return ResponseObject.builder().status(HttpStatus.OK)
                .content(users)
                .build();
    }

    public ResponseObject getUserByRole(String role, boolean isDelete, int page, int size) {
        if (Objects.equals(role.toLowerCase(), "all"))
            return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findAllByDeleted(isDelete, PageRequest.of(page, size))).build();
        Role role1 = Role.valueOf(role);
        return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findByRoleAndDeleted(role1,isDelete, PageRequest.of(page, size))).build();
    }

    public ResponseObject getAll(boolean deleted, int page, int size) {
        var result = userRepository.findAllByDeleted(deleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject adminUpdatePasswordForUser(ResetPasswordDTO passwordDTO, String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().message("User not found!").status(HttpStatus.BAD_REQUEST).build();
        }
        user.setPassword(passwordEncoder.encode(passwordDTO.getPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).content(user).build();
    }

    public ResponseObject logout(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            var disableAccessToken = jwtService.disableAccessToken(user.getAccessToken());
            user.setAccessToken(disableAccessToken);
            userRepository.save(user);
        });
        SecurityContextHolder.clearContext();
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject resetPassword(AuthenticationRequest request) {
        var user = findUserByEmail(request.getEmail());
        if(user == null) return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).content(user).build();
    }

    public ResponseObject softDelete(UUID id) {
        var response = findUserById(id);
        if(response.getStatus() != HttpStatus.OK) {
            return response;
        }

        User user = (User) response.getContent();
        System.out.println(user.getRole());
        if (Objects.equals(user.getRole(), Role.ADMIN) || user.getRole() == Role.MANAGER)
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("This user cannot be deleted.").build();
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject restoreUserById(UUID id) {
        var response = findUserById(id);
        if(response.getStatus() != HttpStatus.OK) {
            return response;
        }
        User user = (User) response.getContent();
        user.setDeleted(false);
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject restoreListUser(List<UUID> ids) {
        ids.stream().map(this::findUserById).forEach(responseObject -> {
            if(responseObject.getStatus() == HttpStatus.OK) {
                User user = (User) responseObject.getContent();
                user.setDeleted(false);
                userRepository.save(user);
            }
        });
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    private ResponseObject findUserById(UUID id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(user).build();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

}
