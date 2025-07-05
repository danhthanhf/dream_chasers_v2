package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;


@Data
@SuperBuilder
@NoArgsConstructor
//@AllArgsConstructor
public class UserBasicDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String phoneNumber;

    private UserStatus status;
    private LocalDateTime lastOnline;


    public UserBasicDTO(String email, String firstName, String lastName, String avatarUrl, String phoneNumber) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
        this.phoneNumber = phoneNumber;
    }
}
