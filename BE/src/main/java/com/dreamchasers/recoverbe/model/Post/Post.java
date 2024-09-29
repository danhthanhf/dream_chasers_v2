package com.dreamchasers.recoverbe.model.Post;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.model.User.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post extends BaseModel {
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String thumbnailUrl;
    private int totalComment = 0;
    private PostStatus status  = PostStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();
}
