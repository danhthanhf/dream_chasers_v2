package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.entity.Request;
import com.dreamchasers.recoverbe.enums.ReferenceType;
import com.dreamchasers.recoverbe.enums.RequestType;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.repository.RequestRepository;
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
