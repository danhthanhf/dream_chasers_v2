package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserBasicDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
}
