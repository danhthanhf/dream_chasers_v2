package com.dreamchasers.recoverbe.entity.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import com.dreamchasers.recoverbe.entity.User.User;
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
public class Enrollment extends BaseModel {
    private boolean isCompleted;
    private int totalLessons;
    private int totalCompletedLessons;

    @ManyToOne(fetch = FetchType.LAZY)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Progress> progresses = new ArrayList<>();

    public void updateProgress(int completedCount) {
        this.totalCompletedLessons += completedCount;
        this.isCompleted = this.totalCompletedLessons == this.totalLessons;
    }
}
