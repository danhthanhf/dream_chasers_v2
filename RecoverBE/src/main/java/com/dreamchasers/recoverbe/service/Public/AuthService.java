package com.dreamchasers.recoverbe.service.Public;

import com.dreamchasers.recoverbe.controller.ResponseObject;
import com.dreamchasers.recoverbe.dto.JwtDTO;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.helper.Request.RegisterRequest;
import com.dreamchasers.recoverbe.jwt.JwtService;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


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
                .build();
        userRepository.save(user);
        return ResponseObject.builder()
                .status(HttpStatus.CREATED)
                .build();
    }

    public ResponseObject authenticate(AuthenticationRequest request) {
        try {
            var user = userDetailsService.loadUserByUsername(request.getEmail());
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            JwtDTO jwtDTO = JwtDTO.builder()
                    .accessToken(jwtService.generateAccessToken(user))
                    .refreshToken(jwtService.generateRefreshToken(user))
                    .build();
            return ResponseObject.builder().status(HttpStatus.OK).data(jwtDTO).build();
        }
        catch (UsernameNotFoundException ex) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message(ex.getMessage()).build();
        }
        catch (Exception e) {
            return ResponseObject.builder().status(HttpStatus.UNAUTHORIZED).message("Email hoặc mật khẩu không đúng!").build();
        }
    }

    public ResponseObject sendCode(String email) {
        var user = findUserByEmail(email);
        if(user != null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Email đã tồn tại!").build();
        }
        String code = getVerifyCode();
        mailService.sendCode(email, code);
        return ResponseObject.builder().status(HttpStatus.OK).message("Gửi mã thành công!").data(code).build();
    }

    public ResponseObject sendResetPasswordEmail(String email) {
        var user = findUserByEmail(email);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Email không tồn tại!").build();
        }
        String code = getVerifyCode();
        mailService.sendMailResetPassword(email, code);
        return ResponseObject.builder().status(HttpStatus.OK).message("Gửi mã thành công!").data(code).build();
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


