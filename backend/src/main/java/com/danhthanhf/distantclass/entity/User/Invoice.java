package com.danhthanhf.distantclass.entity.User;

import com.danhthanhf.distantclass.entity.CourseKit.Course;
import com.danhthanhf.distantclass.common.enums.MethodPayment;
import com.danhthanhf.distantclass.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Invoice extends BaseEntity {
    private MethodPayment method;
    private long total;
    private String content;

    @ManyToOne
    private User user;

    @ManyToOne
    private Course course;
}
