package com.dreamchasers.recoverbe.dto;

import lombok.Builder;

@Builder
public class JwtDTO {
    private String accessToken;
    private String refreshToken;
}
