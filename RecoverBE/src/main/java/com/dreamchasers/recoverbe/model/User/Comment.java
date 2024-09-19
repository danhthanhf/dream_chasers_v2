package com.dreamchasers.recoverbe.model.User;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment extends BaseModel {
    @Column(columnDefinition = "TEXT")
    private String content;
    private String userEmail;
    private String userName;
    private String avatar;
    private int parentId;
    private String replyToUser;
    private String replyToUserName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User user;

    @OneToOne
    private Comment parentComment;

}
