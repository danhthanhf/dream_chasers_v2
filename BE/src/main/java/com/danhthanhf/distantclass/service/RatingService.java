package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.entity.CourseKit.Rating;
import com.danhthanhf.distantclass.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;

    public Rating getRatingByUserAndCourse(UUID userId, UUID courseId) {
        return ratingRepository.findByUserIdAndCourseId(userId, courseId).orElse(null);
    }

}
