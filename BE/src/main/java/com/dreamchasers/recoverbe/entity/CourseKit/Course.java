package com.dreamchasers.recoverbe.entity.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.CoursePrice;
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
public class Course extends BaseModel {
    private String title;
    private String video;
    @Enumerated(EnumType.STRING)
    private CoursePrice price;
    private int discount;
    private double rating;
    private int totalRating;
    private int totalDuration;
    private int totalRegister;
    private boolean deleted = false;
    private boolean visible = false;
    private String reasonReject;
    @Enumerated(EnumType.STRING)
    private CoursePostStatus status = CoursePostStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String thumbnail;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Section> sections = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private List<Category> categories = new ArrayList<>();
}
