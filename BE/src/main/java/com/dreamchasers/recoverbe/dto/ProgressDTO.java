package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ProgressDTO {
    private boolean isCompleted;
    private boolean isLocked;
    private int timeStamp;
    private int duration;
    private UUID lessonId;

}
