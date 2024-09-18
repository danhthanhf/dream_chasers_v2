package com.example.demo.entity.data;


import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;
    private LocalDateTime date = LocalDateTime.now();
    private String title;
    private  String thumbnail;
    private boolean isDeleted = false;
    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.PENDING;

    @ManyToOne
    @JsonManagedReference
    private User user;
    @ManyToMany
    private List<Tag> tags;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    private int totalComment = 0;
}
