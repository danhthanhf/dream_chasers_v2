package com.dreamchasers.recoverbe.model.Post;

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
    private String title;
    private int quantityOfPost = 1;
}
