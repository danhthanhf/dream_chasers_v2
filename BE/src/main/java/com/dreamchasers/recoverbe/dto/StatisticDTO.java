package com.dreamchasers.recoverbe.dto;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import net.bytebuddy.implementation.bind.annotation.Super;

import java.util.Map;


@SuperBuilder
@Data
public class StatisticDTO {
    private Map<Integer, Long> data;
    private long total;
}
