package com.dreamchasers.recoverbe.model.Post;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.model.User.User;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.data.jpa.repository.Modifying;

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
    @Column(columnDefinition = "int default 0")
    private int totalComment = 0;
    @Column(columnDefinition = "int default 0")
    private int likes = 0;
    @Column(columnDefinition = "int default 0")
    private int views = 0;
    @Column(columnDefinition = "varchar(255) default PENDING")
    private PostStatus status  = PostStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany
    private List<Tag> tags;

}
