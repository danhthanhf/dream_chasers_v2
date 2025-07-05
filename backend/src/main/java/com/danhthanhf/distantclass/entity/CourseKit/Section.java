package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.BaseEntity;
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
public class Section extends BaseEntity {
    private String title;
    private int totalDuration;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderColumn(name = "lessons_order")
    private List<com.danhthanhf.distantclass.entity.CourseKit.Lesson> lessons = new ArrayList<>();

}
