package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.entity.Request;
import com.danhthanhf.distantclass.common.enums.RequestType;
import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RequestService {
    private final RequestRepository repository;
    private final UserService userService;

    public ResponseObject sendRegisterInstructor() {
        var user = userService.getCurrentUser();

        var request = Request.builder()
                .requestType(RequestType.REGISTER_INSTRUCTOR)
                .referenceId(user.getId())
                .build();
        repository.save(request);
        return ResponseObject.builder()
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
