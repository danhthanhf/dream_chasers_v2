package com.dreamchasers.recoverbe.exception;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponseObject> handlerNEntityNotFoundException(EntityNotFoundException e) {
        var response = ResponseObject.builder().status(HttpStatus.NOT_FOUND).message(e.getMessage()).build();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject> handleAllException(Exception e) {
        var response = ResponseObject.builder().status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(e.getMessage()).build();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
