package com.dreamchasers.recoverbe.model.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Progress extends BaseModel {
    private boolean isCompleted;
    private int timeStamp;
    @ManyToOne
    @JsonIgnore
    private Lesson lesson;
}
