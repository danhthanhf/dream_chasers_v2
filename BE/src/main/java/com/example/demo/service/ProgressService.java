package com.example.demo.service;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Enrollment;
import com.example.demo.entity.data.Progress;
import com.example.demo.repository.data.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressService {
    private final ProgressRepository progressRepository;
    @Autowired
    public ProgressService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public List<Progress> createProgressList(Course course) {
        List<Progress> progressList = new ArrayList<>();
        for(var section: course.getSections()) {
            for(var lesson: section.getLessons()) {
                progressList.add(Progress.builder().lesson(lesson).isCompleted(false).build());
            }
        }
        return progressRepository.saveAll(progressList);
    }
}
