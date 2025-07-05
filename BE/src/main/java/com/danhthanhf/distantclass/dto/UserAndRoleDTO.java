package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.entity.User.Role;
import com.danhthanhf.distantclass.entity.User.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

@Builder
@Data
public class UserAndRoleDTO {
    private Page<User> users;
    private Role[] roles;
}
