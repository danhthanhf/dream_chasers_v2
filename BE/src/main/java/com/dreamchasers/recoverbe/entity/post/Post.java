package com.dreamchasers.recoverbe.entity.post;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.entity.User.Comment;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
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
    private String thumbnail;
    private String description;
    private String reasonReject;
    private int totalComment;
    private int likes;
    private int views;
    @Column(columnDefinition = "varchar(255) default PENDING")
    private CoursePostStatus status  = CoursePostStatus.PENDING;

//    @JsonManagedReference
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Tag> tags;

}
