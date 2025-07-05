package com.dreamchasers.recoverbe.dto;

import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatusChangeDTO {
    private String detail;
    private CoursePostStatus status;

}
