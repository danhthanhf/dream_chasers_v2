package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.entity.CourseKit.Rating;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class StatisticRating {
    private Page<Rating> rating;
    private List<Map<Integer, Integer>> statistic;
}
