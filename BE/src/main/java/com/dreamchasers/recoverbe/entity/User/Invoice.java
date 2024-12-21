package com.dreamchasers.recoverbe.entity.User;

import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.enums.MethodPayment;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Invoice extends BaseModel {
    private MethodPayment method;
    private long total;
    private String content;

    @ManyToOne
    private User user;

    @ManyToOne
    private Course course;
}
