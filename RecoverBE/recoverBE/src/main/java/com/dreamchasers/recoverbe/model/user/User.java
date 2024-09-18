package com.dreamchasers.recoverbe.model.user;

import com.dreamchasers.recoverbe.helper.model.BaseModel;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseModel {
    private String email;
    private String firstName;
    private String lastName;
    private String avtar;
    private Role role = Role.USER;
}
