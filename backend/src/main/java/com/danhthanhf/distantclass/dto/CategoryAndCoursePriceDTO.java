package com.danhthanhf.distantclass.dto;

import com.danhthanhf.distantclass.entity.CourseKit.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryAndCoursePriceDTO {
    private Page<Category> categories;
    private List<CoursePriceDTO> prices;
}
