package com.dreamchasers.recoverbe.controller.User;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;

import com.dreamchasers.recoverbe.service.UserService;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatus extends BaseModel {
    @Enumerated(EnumType.STRING)
    private com.dreamchasers.recoverbe.enums.UserStatus status;
    private LocalDateTime lastActive;

}
