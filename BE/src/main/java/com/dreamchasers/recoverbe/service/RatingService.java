package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.entity.CourseKit.Rating;
import com.dreamchasers.recoverbe.repository.RatingRepository;
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
