package com.danhthanhf.distantclass.entity.post;

import com.danhthanhf.distantclass.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Tag extends BaseEntity {
    private String name;
    private int totalPost = 1;
}
