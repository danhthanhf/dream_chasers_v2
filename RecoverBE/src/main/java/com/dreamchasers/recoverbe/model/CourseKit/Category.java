package com.dreamchasers.recoverbe.model.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Category extends BaseModel {
    private String name;
}
