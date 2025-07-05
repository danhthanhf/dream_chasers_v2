package com.danhthanhf.distantclass.entity.CourseKit;

import com.danhthanhf.distantclass.entity.BaseEntity;
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
public class Progress extends BaseEntity {
    private boolean isCompleted;
    private int timeStamp;
    private int duration;
    private boolean isLocked;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Lesson lesson;
}
