package com.example.demo.dto;

import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;


@Builder
@Data
public class UsersAndRoles {
    private Page<User> users;
    private Role[] roles;
}
