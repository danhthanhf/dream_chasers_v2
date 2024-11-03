package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.VNPAY.VNPAYConfig;
import com.dreamchasers.recoverbe.dto.ResetPasswordDTO;
import com.dreamchasers.recoverbe.dto.UserAndRoleDTO;
import com.dreamchasers.recoverbe.dto.UserDTO;
import com.dreamchasers.recoverbe.enums.MethodPayment;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.Handle.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.Request.AuthenticationRequest;
import com.dreamchasers.recoverbe.jwt.JwtService;
import com.dreamchasers.recoverbe.entity.Post.Post;
import com.dreamchasers.recoverbe.entity.User.Role;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.repository.CourseRepository;
import com.dreamchasers.recoverbe.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CloudinaryService cloudinaryService;
    private final EnrollService enrollService;
    private final ConvertService convertService;

    public User findById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    public ResponseObject getPayment(String method, UUID courseId) {
        var course = courseRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        var user = getCurrentUser();
        if(!Objects.equals(method,"vnpay")) return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Just VNPAY method").build();

        long amount = course.getPrice().getPrice() * 100L;

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String bankCode = "NCB";

        String vnp_TxnRef = VNPAYConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;

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
        vnp_Params.put("vnp_ReturnUrl", VNPAYConfig.vnp_ReturnUrl + "/" + user.getId() + "/" + courseId);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                }
                catch (Exception ex) {
                    System.out.println("getPayment: " + ex.getMessage());
                    log.info("Error while get payment" + ex.getMessage());
                    return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Error while get payment").build();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        String paymentUrl = VNPAYConfig.vnp_PayUrl + "?" + queryUrl;
        return ResponseObject.builder().status(HttpStatus.OK).content(paymentUrl).build();
    }

    public User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public void Save(User user) {
        userRepository.save(user);
    }

    public boolean isPostFavorite(String email, Post post) {
        User user = (User) getUserByEmail(email).getContent();
        if (user == null) {
            return false;
        }
        return user.getFavoritePosts().contains(post);
    }

    public ResponseObject checkEnrollment(String title) {
        var user = getCurrentUser();
        var course = courseRepository.findByTitle(title).orElseThrow(() -> new EntityNotFoundException("Course not found"));

        boolean isEnrolled = enrollService.isUserEnrolled(user.getId(), course.getId());

        var courseDTO = convertService.convertToCourseAndCheckEnrollmentDTO(course, isEnrolled);
        return ResponseObject.builder().content(courseDTO).status(HttpStatus.OK).message("User can enroll this course").build();
    }

    public ResponseObject enrollCourse(UUID courseId) {
        var user = getCurrentUser();
        if(enrollService.isUserEnrolled(user.getId(), courseId)){
            return ResponseObject.builder()
                    .content("User already enrolled this course")
                    .status(HttpStatus.CONFLICT)
                    .build();
        }

        enrollService.enrollCourse(user, courseId);

        return ResponseObject.builder()
                .content("Enroll course successfully")
                .status(HttpStatus.OK)
                .build();
    }

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
        res[0] = ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
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
        var user = findByEmail(request.getEmail());
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

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

}
