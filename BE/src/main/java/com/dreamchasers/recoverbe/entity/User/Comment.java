package com.dreamchasers.recoverbe.entity.User;

import com.dreamchasers.recoverbe.enums.ReferenceType;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment extends BaseModel {
    private UUID courseId;
    private UUID lessonId;

    private int totalFollowers;

    @Column(columnDefinition = "TEXT")
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "parent_id")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference
    private List<Comment> replies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JsonBackReference
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User repliedUser;
}
