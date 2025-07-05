package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.BaseEntity;
import com.danhthanhf.distantclass.entity.User.User;
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
public class Enrollment extends BaseEntity {
    private boolean isCompleted;
    private int totalLessons;
    private int totalCompletedLessons;

    @ManyToOne(fetch = FetchType.EAGER)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderColumn(name = "progress_order")
    private List<Progress> progresses = new ArrayList<>();

    public void updateProgress(int completedCount) {
        this.totalCompletedLessons += completedCount;
        this.isCompleted = this.totalCompletedLessons == this.totalLessons;
    }
}
