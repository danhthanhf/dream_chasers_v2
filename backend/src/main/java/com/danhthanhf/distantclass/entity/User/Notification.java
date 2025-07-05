package com.danhthanhf.distantclass.entity.User;

import com.danhthanhf.distantclass.common.enums.ReferenceType;
import com.danhthanhf.distantclass.entity.BaseEntity;
import com.danhthanhf.distantclass.common.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends BaseEntity {
    private UUID commentId;
    private UUID lessonId;
    private UUID courseId;
    private String postTitle;
    @Enumerated(EnumType.STRING)
    private ReferenceType referenceType;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(columnDefinition = "TEXT")
    private String content;
    private String reasonReject;
    private String title;
    private boolean isRead = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    @ToString.Exclude
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    private User sender;
}
