package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.dto.UserDTO;
import com.danhthanhf.distantclass.common.enums.UserStatus;
import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.dto.AuthenticationRequest;
import com.danhthanhf.distantclass.dto.RegisterRequest;
import com.danhthanhf.distantclass.helper.converters.ConvertService;
import com.danhthanhf.distantclass.common.util.JwtUtil;
import com.danhthanhf.distantclass.entity.User.Role;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Objects;


@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtService;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final ConvertService convertService;


    private boolean isEmailExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public ResponseObject register(RegisterRequest request) {
        if(isEmailExist(request.getEmail())) {
            return ResponseObject.builder()
                    .message("Email đã tồn tại!")
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .build();
        userRepository.save(user);
        return ResponseObject.builder()
                .status(HttpStatus.CREATED)
                .build();
    }

    public User refreshAccessToken(User user) {
        if(user == null) return null;
        user.setAccessToken(jwtService.generateAccessToken(user));

        return user;
    }

    public ResponseObject authenticate(AuthenticationRequest request) {
        try {
            User user = (User) userDetailsService.loadUserByUsername(request.getEmail());

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            user = refreshAccessToken(user);

            UserDTO userDTO = convertService.convertToUserDTO(user);

            userService.updateStatus(user.getEmail(), UserStatus.ONLINE);

            return ResponseObject.builder().status(HttpStatus.OK).content(userDTO).build();

        } catch (UsernameNotFoundException ex) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email does not exist!").build();
        } catch (BadCredentialsException e) {
            log.error(e.getMessage());
            return ResponseObject.builder().status(HttpStatus.UNAUTHORIZED).message("Email or password is incorrect!").build();
        } catch (LockedException e) {
            log.error(e.getMessage());
            return ResponseObject.builder().status(HttpStatus.LOCKED).message("The account has been locked!").build();
        } catch (DisabledException e) {
            log.error(e.getMessage());
            return ResponseObject.builder().status(HttpStatus.FORBIDDEN).message("The account has been disabled!").build();
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseObject.builder().status(HttpStatus.INTERNAL_SERVER_ERROR).message("System error!").build();
        }
    }


    public ResponseObject sendCode(String email) {
        var user = findUserByEmail(email);
        if(user != null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Email đã tồn tại!").build();
        }
        String code = getVerifyCode();
        mailService.sendCode(email, code);
        return ResponseObject.builder().status(HttpStatus.OK).message("Gửi mã thành công!").content(code).build();
    }

    public ResponseObject sendResetPasswordEmail(String email) {
        var user = findUserByEmail(email);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        }
        String code = getVerifyCode();
        mailService.sendMailResetPassword(email, code);
        return ResponseObject.builder().status(HttpStatus.OK).message("Gửi mã thành công!").content(code).build();
    }

    public ResponseObject resetPassword(AuthenticationRequest request) {
        var optionalUser = userRepository.findByEmail(request.getEmail());

        if(optionalUser.isEmpty()) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        }

        User user = optionalUser.get();
        if(!Objects.equals(user.getResetCode(), request.getCode()) || user.getResetCode() == null) {
            return ResponseObject.builder().status(HttpStatus.UNAUTHORIZED).message("Mã xác thực không đúng!").build();
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return ResponseObject.builder().status(HttpStatus.OK).build();
    }

    public String getVerifyCode() {
        SecureRandom random = new SecureRandom();
        String characters = "0123456789";
        StringBuilder sb = new StringBuilder(6);
        for(int i = 0; i < 6; i++) {
            sb.append(characters.charAt(random.nextInt(characters.length())));
        }
        return sb.toString();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}


