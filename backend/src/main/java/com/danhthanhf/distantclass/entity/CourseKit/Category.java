package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Category extends BaseEntity {
    private String name;
    private int totalCourse;
}
