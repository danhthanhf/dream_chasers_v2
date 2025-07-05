package com.dreamchasers.recoverbe.entity.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.entity.User.Comment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Lesson extends BaseModel {
    private String title;
    private String video;
    private String description;
    private int duration;

    @OneToMany(cascade = {CascadeType.REFRESH, CascadeType.REMOVE})
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();
}
