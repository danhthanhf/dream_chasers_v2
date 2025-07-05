package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Rating extends BaseEntity {
    private double rating;
    private String comment;
    private UUID courseId;

    @ManyToOne
    private User user;
}
