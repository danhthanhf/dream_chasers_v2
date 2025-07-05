package com.danhthanhf.distantclass.entity.post;

import com.danhthanhf.distantclass.entity.BaseEntity;
import com.danhthanhf.distantclass.entity.User.Comment;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
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
public class Post extends BaseEntity {
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
