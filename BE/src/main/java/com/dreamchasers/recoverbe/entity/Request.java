package com.dreamchasers.recoverbe.entity;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.ReferenceType;
import com.dreamchasers.recoverbe.enums.RequestType;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import java.util.UUID;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Request extends BaseModel {
    private String content;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String reasonReject;

    @Column(nullable = false)
    private UUID referenceId;
    @Column(nullable = false)
    private RequestType requestType;

    @ManyToOne
    private User user;
}
