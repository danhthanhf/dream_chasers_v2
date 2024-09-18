package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
@Data
@Builder
public class StatisticsDTO {
    private Page<CourseStatisticDTO> coursesCreated;
    private Page<UserStatisticDTO> usersRegistered;
    private Page<InvoiceStatisticDTO> invoicesCreated;
    private long invoiceTotal;
}