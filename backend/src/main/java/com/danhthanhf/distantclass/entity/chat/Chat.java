package com.danhthanhf.distantclass.entity.chat;

import com.danhthanhf.distantclass.entity.BaseEntity;
import jakarta.persistence.*;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Chat extends BaseEntity {
    private LocalDateTime lastMessageTime;

    private boolean blocked;

    @CreationTimestamp
    private LocalDateTime readTime;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    List<UserChat> participants;
}
