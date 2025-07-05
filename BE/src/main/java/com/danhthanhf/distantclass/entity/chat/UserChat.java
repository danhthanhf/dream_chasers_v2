package com.danhthanhf.distantclass.entity.chat;

import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserChat extends BaseEntity {
    @ManyToOne (cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private User user;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private com.danhthanhf.distantclass.entity.chat.Chat chat;

    private boolean isRead;
    private boolean blocked;

    public UserChat(User user, boolean b) {
        this.user = user;
        this.isRead = b;
    }
}
