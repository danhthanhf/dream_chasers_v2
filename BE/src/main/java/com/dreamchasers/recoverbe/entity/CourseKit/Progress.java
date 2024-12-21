package com.dreamchasers.recoverbe.entity.CourseKit;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
    private int duration;
    private boolean isLocked;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Lesson lesson;
}
