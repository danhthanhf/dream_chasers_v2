package com.dreamchasers.recoverbe.entity.Post;

import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Tag extends BaseModel {
    private String name;
    private int totalPost = 1;
}
