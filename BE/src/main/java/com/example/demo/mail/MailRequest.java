package com.example.demo.mail;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
@Data
@NoArgsConstructor
public class MailRequest {
    private String email;
    private String code;
}
