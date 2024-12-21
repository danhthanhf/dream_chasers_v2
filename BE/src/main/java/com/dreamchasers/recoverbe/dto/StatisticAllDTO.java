package com.dreamchasers.recoverbe.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
public class StatisticAllDTO {
    private Long totalCourse;
    private Long totalUser;
    private Long totalPost;
    private Long totalBalance;

    private StatisticDTO course;
    private StatisticDTO user;
    private StatisticDTO post;
    private StatisticDTO balance;


}
