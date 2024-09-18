package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Data
public class UserStatisticDTO {
    private int id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String avatar;
}
