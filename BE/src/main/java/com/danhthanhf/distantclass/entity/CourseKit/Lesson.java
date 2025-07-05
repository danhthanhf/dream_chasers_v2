package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.BaseEntity;
import com.danhthanhf.distantclass.entity.User.Comment;
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
public class Lesson extends BaseEntity {
    private String title;
    private String video;
    private String description;
    private int duration;

    @OneToMany(cascade = {CascadeType.REFRESH, CascadeType.REMOVE})
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();
}
