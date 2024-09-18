package com.example.demo.auth;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.config.ConfigVNPAY;
import com.example.demo.dto.*;
import com.example.demo.entity.data.*;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.jwt.JwtService;
import com.example.demo.jwt.Token;
import com.example.demo.mail.MailRequest;
import com.example.demo.repository.TokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.LessonRepository;
import com.example.demo.repository.data.NotificationRepository;
import com.example.demo.repository.data.ProgressRepository;
import com.example.demo.service.*;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final CourseRepository courseRepository;
    private final ProgressRepository progressRepository;

    private final JwtService jwtService;
    private final CloudService cloudService;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    private final InvoiceService invoiceService;
    private final CommentService commentService;
    private final EnrollmentService enrollmentService;

    @Autowired
    private AuthService(EnrollmentService enrollmentService, UserRepository userRepository, AuthenticationManager authenticationManager, CourseRepository courseRepository, ProgressRepository progressRepository, JwtService jwtService, CloudService cloudService, PasswordEncoder passwordEncoder, NotificationService notificationService, InvoiceService invoiceService, CommentService commentService, PostService postService) {
        this.userRepository = userRepository;
        this.enrollmentService = enrollmentService;
        this.authenticationManager = authenticationManager;
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
        this.jwtService = jwtService;
        this.cloudService = cloudService;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
        this.invoiceService = invoiceService;
        this.commentService = commentService;
    }

    public ResponseObject getBookmarks (String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(user.getFavoritePosts()).build();
    }

    public ResponseObject deleteCommentById(String email, int id) {
        var comment = commentService.getById(id);
        if(comment == null) {
            return ResponseObject.builder().status(HttpStatus.OK).mess("Delete successfully").build();
        }
        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        user.getComments().remove(comment);
        commentService.deleteById(id);
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Delete successfully").build();
    }

    public ResponseObject removeAllNotificationsByEmail(String email) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not found ").build();
        }
       notificationService.removeAllNotificationsByEmail(user.getId());

        user.setNotifications(new ArrayList<>());
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Remove all notification successfully").build();
    }

    public ResponseObject readAllNotification(String email) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not found ").build();
        }
        var result = notificationService.readAllNotification(user.getId());
        if (result == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("Error while read notification").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }
    public ResponseObject readNotification(String email, int id) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not found ").build();
        }
        var result = notificationService.readNotification(id);
        if (result == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("Error while read notification").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).mess("Read notification successfully").content(result).build();
    }
    public ResponseObject getAllNotificationsByEmail(String email, int page, int size) {
        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not found").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(notificationService.getAllNotificationsByEmail(user.getId(), page, size)).build();
    }


    public ResponseObject updateLessonsIds(String alias, int courseId, List<Integer> lessonIds) {
        var email = alias + "@gmail.com";
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        var progress = progressRepository.findByCourseIdAndUser(courseId, user).orElse(null);
        if (progress == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User has not registered for the course ").build();
        }
        progressRepository.save(progress);
        return ResponseObject.builder().status(HttpStatus.OK).build();
    }

    public ResponseObject getProgressByCourseId(String alias, int courseId) {
        var email = alias + "@gmail.com";
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        var progress = progressRepository.findByCourseIdAndUser(courseId, user).orElse(null);
        if (progress == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User has not registered for the course ").build();
        }
//        var progressDTO = ProgressDTO.builder().course(progress.getCourse()).lessonIds(progress.getLessonIds()).build();

        return ResponseObject.builder().status(HttpStatus.OK).content(null).build();

    }

    private void saveUser(RegisterRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .build();
        userRepository.save(user);
    }

    public boolean register(RegisterRequest request) {
        if(isUsedEmail(request.getEmail())) return  false;
        saveUser(request);
        return true;
    }

    public ResponseObject authenticate(AuthenticationRequest auth) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(auth.getEmail(), auth.getPassword()));
            var user = userRepository.findByEmail(auth.getEmail()).orElse(null);
            if(user == null) {
                return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User is not exist.").build();
            }
            Token token = new Token(jwtService.generateToken(user));
            user.setToken(token);
            var userDTO = getUserDTOFromUser(user);
            userDTO.setToken(token.getToken());
            return ResponseObject.builder().status(HttpStatus.OK).content(userDTO).build();
        }
        catch (AuthenticationException ex) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("error while authentication user with error " + ex.getMessage()).build();
        }
    }

    public UserDTO getUserDTOFromUser(User user) {
        return UserDTO.builder()
                .avatar(user.getAvatar())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }

    public ResponseObject getUserByEmail(String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Username not found").build();
        }
        var userDTO = getUserDTOFromUser(user);
        return ResponseObject.builder().status(HttpStatus.OK).content(userDTO).mess("Successfully").build();
    }



    public boolean isUsedEmail(String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        return user != null;
    }

    public String getVerifyCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder();
        String characters = "1234567890";
        for(int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

    public boolean isValidCode(MailRequest request) {
        User user = findUserByEmail(request.getEmail());
        if(user == null || user.getCode().isEmpty()) return false;
        return user.getCode().get(request.getCode()).isAfter(LocalDateTime.now());
    }

    public ResponseObject resetPassword(ResetPasswordRequest request) {
        var user = findUserByEmail(request.getEmail());
        if(user == null) return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Reset password failed").build();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Reset password successfully").content(user).build();
    }

    public ResponseObject adminUpdatePasswordForUser(PasswordDTO passwordDTO, String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().mess("User not found").status(HttpStatus.BAD_REQUEST).build();
        }
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update password for user successfully").content(user).build();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean saveCode(MailRequest request, String code) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if(user == null) return false;
        Map<String, LocalDateTime> token = new HashMap<String, LocalDateTime>();
        token.put(code, LocalDateTime.now().plus(48, ChronoUnit.HOURS));
        user.setCode(token);
        userRepository.save(user);
        return true;
    }
    public ResponseObject updateProfile(UserDTO userDTO, MultipartFile avatar)  {
        var user = userRepository.findByEmail(userDTO.getEmail()).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Username not found").build();
        }
        if(avatar != null) {
            try {
                user.setAvatar(cloudService.uploadImage(avatar.getBytes()));
            }
            catch (IOException ex) {
                System.out.println("updateProfile:  " + ex.getMessage());
                return ResponseObject.builder().status(HttpStatus.OK).mess("Error occurred when updating profile").content(userDTO).build();
            }
        }
        userDTO.setAvatar(user.getAvatar());
        if(!user.getEmail().contains("@") && userDTO.getEmail().contains("@")) {
            user.setEmail(userDTO.getEmail());
        }
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update successfully").content(user).build();
    }

    public ResponseObject updatePassword(PasswordDTO passwordDTO) {
        var user = userRepository.findByEmail(passwordDTO.getEmail()).orElse(null);
        if(user == null) {
            return ResponseObject.builder().mess("User not found").status(HttpStatus.BAD_REQUEST).build();
        }
        if(!passwordEncoder.matches( passwordDTO.getOldPassword(), user.getPassword())) {
            return ResponseObject.builder().mess("Old password not correct").status(HttpStatus.BAD_REQUEST).build();
        }
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update password successfully").build();
    }

    public ResponseObject enrollCourse(EnrollDTO enrollDTO) {

        var user = userRepository.findByEmail(enrollDTO.getEmail()).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }

        var temp = progressRepository.findByCourseIdAndUser(enrollDTO.getCourseId(), user).orElse(null);
        if(temp != null) {
            return ResponseObject.builder().status(HttpStatus.OK).mess("Continue studying").content(temp).build();
        }

        var course = courseRepository.findById(enrollDTO.getCourseId()).orElse(null);
        if (course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course not found").build();
        }

        enrollmentService.createNewEnrollment(user, course);

        return ResponseObject.builder().status(HttpStatus.OK).mess("Enroll course successfully").content(enrollmentService).build();

    }

    public ResponseObject getPayment(String method, int courseId, String email) {
        var course = courseRepository.findById(courseId).orElse(null);
        if(course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course not found").build();
        }
        if(!Objects.equals(method,"vnpay")) return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Just VNPAY method").build();
        long amount = course.getPrice() * 100L;

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String bankCode = "NCB";

        String vnp_TxnRef = ConfigVNPAY.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = ConfigVNPAY.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Pay for the course:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", ConfigVNPAY.vnp_ReturnUrl + "/" + email + "/" + courseId);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
             try {
                 hashData.append(fieldName);
                 hashData.append('=');
                 hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                 query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                 query.append('=');
                 query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
             }
             catch (Exception ex) {
                 System.out.println("getPayment: " + ex.getMessage());
                 log.info("Error while get payment" + ex.getMessage());
                 return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Error while get payment").build();
             }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = ConfigVNPAY.hmacSHA512(ConfigVNPAY.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = ConfigVNPAY.vnp_PayUrl + "?" + queryUrl;
        return ResponseObject.builder().status(HttpStatus.OK).content(paymentUrl).build();
    }


    public ResponseObject unLockCourse(String email, int courseId, MethodPayment method) {
        var user = userRepository.findByEmail(email).orElse(null);
        var course = courseRepository.findById(courseId).orElse(null);
        if(user == null || course == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User or Course not found").build();
        }
        invoiceService.saveForUser(user, course, method);
        Progress progress = Progress.builder()
                    .build();
        user.getProgresses().add(progress);
        progressRepository.save(progress);
        return ResponseObject.builder().status(HttpStatus.OK).content("Enroll course successfully").build();
    }

    public ResponseObject getAllCourseByEmail(String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
//        List<ProgressDTO> progresses = progressRepository.findAllDTOByUserEmail(email);
        List<ProgressDTO> progresses = null;
//
        return ResponseObject.builder().status(HttpStatus.OK).content(progresses).build();
    }
}

