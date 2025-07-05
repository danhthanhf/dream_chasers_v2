package com.danhthanhf.distantclass.entity.User;

import com.danhthanhf.distantclass.entity.CourseKit.Lesson;
import com.danhthanhf.distantclass.entity.BaseEntity;
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
public class Note extends BaseEntity {
    @Column(columnDefinition = "TEXT")
    private String content;
    private int time;
    private UUID courseId;

    @ManyToOne
    private Lesson lesson;
    @ManyToOne
    private User user;
}
