package com.dreamchasers.recoverbe.model.CourseKit;

import com.dreamchasers.recoverbe.helper.model.BaseModel;
import com.dreamchasers.recoverbe.model.user.Comment;
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
    private String videoUrl;
    private String description;
    private int duration;
    private int order;

    @OneToMany
    private List<Comment> comments = new ArrayList<>();
}
