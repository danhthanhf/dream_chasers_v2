package com.dreamchasers.recoverbe.entity.chat;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Chat extends BaseModel {
    private LocalDateTime lastMessageTime;

    private boolean blocked;

    @CreationTimestamp
    private LocalDateTime readTime;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    List<UserChat> participants;
}
