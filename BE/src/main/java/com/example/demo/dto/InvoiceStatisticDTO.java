package com.example.demo.dto;

import com.example.demo.entity.data.MethodPayment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@Data
public class InvoiceStatisticDTO {
    private int id;
    private LocalDateTime createdDate;
    private MethodPayment methodPayment;
    private long totalInvoice;
    private String content;
    private UserStatisticDTO user;
}
