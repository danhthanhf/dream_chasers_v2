package com.dreamchasers.recoverbe.helper.Request;

import lombok.Builder;
import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
    private String code;
}
