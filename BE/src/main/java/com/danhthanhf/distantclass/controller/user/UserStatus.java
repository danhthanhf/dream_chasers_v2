package com.danhthanhf.distantclass.controller.User;

import com.danhthanhf.distantclass.entity.BaseEntity;

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
public class UserStatus extends BaseEntity {
    @Enumerated(EnumType.STRING)
    private com.danhthanhf.distantclass.common.enums.UserStatus status;
    private LocalDateTime lastActive;

}
