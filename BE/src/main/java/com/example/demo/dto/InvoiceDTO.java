package com.example.demo.dto;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.MethodPayment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private int id;
    private final LocalDateTime date;
    private final long total;
    private String content;
    private MethodPayment method;
    private final UserStatisticDTO user;
    private Course course;

    public InvoiceDTO(Integer id, LocalDateTime date, Long total, String content, MethodPayment method, UserStatisticDTO user) {
        this.id = id;
        this.date = date;
        this.total = total;
        this.content = content;
        this.method = method;
        this.user = user;
    }

}
