package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.entity.CourseKit.Progress;
import com.dreamchasers.recoverbe.entity.User.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDTO {
    private String email;
    private String bio;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatarUrl;
    private String accessToken;
    private boolean isInstructor;
    private List<Progress> progresses;
    private Role role;
}
