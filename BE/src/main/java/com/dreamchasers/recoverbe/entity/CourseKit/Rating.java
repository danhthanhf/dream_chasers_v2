package com.dreamchasers.recoverbe.entity.CourseKit;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;

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
public class Rating extends BaseModel {
    private double rating;
    private String comment;
    private UUID courseId;

    @ManyToOne
    private User user;
}
