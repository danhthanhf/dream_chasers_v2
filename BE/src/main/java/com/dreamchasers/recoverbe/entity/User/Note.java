package com.dreamchasers.recoverbe.entity.User;

import com.dreamchasers.recoverbe.entity.CourseKit.Lesson;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.persistence.Column;
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
public class Note extends BaseModel {
    @Column(columnDefinition = "TEXT")
    private String content;
    private int time;
    private UUID courseId;

    @ManyToOne
    private Lesson lesson;
    @ManyToOne
    private User user;
}
