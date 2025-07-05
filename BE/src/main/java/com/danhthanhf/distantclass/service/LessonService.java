package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.dto.SectionDTO;
import com.danhthanhf.distantclass.entity.CourseKit.Lesson;
import com.danhthanhf.distantclass.entity.CourseKit.Section;
import com.danhthanhf.distantclass.entity.User.Comment;
import com.danhthanhf.distantclass.exception.EntityNotFoundException;
import com.danhthanhf.distantclass.repository.LessonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public Lesson saveComment(UUID lessonId, Comment comment) {
        var lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new EntityNotFoundException("Lesson not found"));
        lesson.getComments().add(comment);

        lessonRepository.save(lesson);
        return lesson;
    }

    public List<Lesson> updateLessonsOfSection(Section oldSection, SectionDTO newSection) {
        if (newSection.getLessons().isEmpty()) {
            lessonRepository.deleteAll(oldSection.getLessons());
            oldSection.setLessons(null);
            return null;
        }


        var lessonsUpdate = new ArrayList<Lesson>();

        for(var newLesson : newSection.getLessons()) {
            var currentLesson = oldSection.getLessons().stream()
                    .filter(l -> newLesson.getId() == l.getId())
                    .findFirst()
                    .orElse(null);

            if(currentLesson != null) {
                currentLesson.setDescription(newLesson.getDescription());
                currentLesson.setTitle(newLesson.getTitle());
                currentLesson.setVideo(newLesson.getVideo());
            } else {
                currentLesson = Lesson.builder()
                        .description(newLesson.getDescription())
                        .video(newLesson.getVideo())
                        .title(newLesson.getTitle())
                        .build();
                oldSection.getLessons().add(currentLesson);
            }
                lessonsUpdate.add(currentLesson);
        }

        oldSection.setLessons(oldSection.getLessons().stream().peek(lesson -> {
            if (lessonsUpdate.stream().noneMatch(l -> l.getId() != null && l.getId().equals(lesson.getId()))) {
                lesson.setDeleted(true);
                lessonRepository.save(lesson);
            }
        }).collect(Collectors.toList()));


        return lessonsUpdate;
    }

}
