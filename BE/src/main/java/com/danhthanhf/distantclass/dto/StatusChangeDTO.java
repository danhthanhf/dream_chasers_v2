package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatusChangeDTO {
    private String detail;
    private CoursePostStatus status;

}
