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
    private int discount;
    private int totalDuration;
    private int totalRegister;
    private int totalRating;

    private String title;
    private String video;
    private String reasonReject;

    private double scoreRating;

    private boolean deleted = false;
    private boolean visible = false;
    private boolean enableQA = false;

    @Enumerated(EnumType.STRING)
    private CoursePrice price;


    @OneToMany
    private List<Rating> ratings = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private CoursePostStatus status = CoursePostStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String thumbnail;


    @ManyToOne(fetch = FetchType.EAGER)
    private User author;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @OrderColumn(name = "section_order")
    private List<Section> sections = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private List<Category> categories = new ArrayList<>();

}
