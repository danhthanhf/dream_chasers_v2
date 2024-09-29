package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResetPasswordDTO {
    private String email;
    private String password;
}
