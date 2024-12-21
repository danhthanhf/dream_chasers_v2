package com.dreamchasers.recoverbe.entity.CourseKit;

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
public class Section extends BaseModel {
    private String title;
    private int totalDuration;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderColumn(name = "lessons_order")
    private List<Lesson> lessons = new ArrayList<>();

}
