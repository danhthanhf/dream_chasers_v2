package com.danhthanhf.distantclass.entity;

import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.common.enums.RequestType;
import com.danhthanhf.distantclass.entity.BaseEntity;
import jakarta.persistence.Column;
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
public class Request extends BaseEntity {
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
