package com.dreamchasers.recoverbe.model.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.model.User.Comment;
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

    @OneToMany(cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}
