package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.BaseEntity;
import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.common.enums.CoursePrice;
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
public class Course extends BaseEntity {
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
