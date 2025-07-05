package com.danhthanhf.distantclass.dto;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
    private String code;
}
