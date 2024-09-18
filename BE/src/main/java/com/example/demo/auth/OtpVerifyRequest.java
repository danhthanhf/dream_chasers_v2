package com.example.demo.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OtpVerifyRequest {
    private String phoneNumber;
    private String otp;
}
