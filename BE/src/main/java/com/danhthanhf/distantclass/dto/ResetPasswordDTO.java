package com.danhthanhf.distantclass.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResetPasswordDTO {
    private String email;
    private String password;
}
