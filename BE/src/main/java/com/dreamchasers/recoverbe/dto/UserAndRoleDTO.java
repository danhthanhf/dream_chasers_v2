package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.entity.User.Role;
import com.dreamchasers.recoverbe.entity.User.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

@Builder
@Data
public class UserAndRoleDTO {
    private Page<User> users;
    private Role[] roles;
}
