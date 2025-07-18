package com.danhthanhf.distantclass.common.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@Builder
public class ResponseObject {
    private String message;
    private Object content;
    private HttpStatus status;
}
