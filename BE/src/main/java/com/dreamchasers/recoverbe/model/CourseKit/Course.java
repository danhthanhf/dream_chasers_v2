package com.dreamchasers.recoverbe.model.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
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
    private double price;
    private double discount;
    private double rating;
    private int totalDuration;
    private int totalRegister;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String thumbnail;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Section> sections = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private List<Category> categories = new ArrayList<>();
}
