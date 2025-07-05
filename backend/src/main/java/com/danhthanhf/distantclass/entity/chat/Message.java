package com.danhthanhf.distantclass.entity.chat;

import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.entity.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Message extends BaseEntity {
    @Column(columnDefinition = "TEXT")
    private String content;
    private String img;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonIgnore
    private Chat chat;

    @ManyToOne
    private User sender;
}
