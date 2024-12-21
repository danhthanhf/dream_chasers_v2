package com.dreamchasers.recoverbe.entity.chat;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;
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
public class UserChat extends BaseModel {
    @ManyToOne (cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private User user;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private Chat chat;

    private boolean isRead;
    private boolean blocked;

    public UserChat(User user, boolean b) {
        this.user = user;
        this.isRead = b;
    }
}
