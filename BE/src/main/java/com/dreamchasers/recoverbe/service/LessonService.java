package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.SectionDTO;
import com.dreamchasers.recoverbe.model.CourseKit.Lesson;
import com.dreamchasers.recoverbe.model.CourseKit.Section;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public Lesson saveComment(UUID lessonId, Comment comment) {
        var lesson = lessonRepository.findById(lessonId).orElse(null);
        if(lesson == null) {
            return null;
        }
        lesson.getComments().add(comment);


        lessonRepository.save(lesson);
        return lesson;
    }

    public List<Lesson> updateLessonsOfSection(Section oldSection, SectionDTO newSection) {
        if(newSection.getLessons().isEmpty()) {
            oldSection.setLessons(oldSection.getLessons().stream().peek(lesson -> lesson.setDeleted(true)).collect(Collectors.toList()));
            for (var oldLesson:
                    oldSection.getLessons()) {
                oldLesson.setDeleted(true);
                lessonRepository.save(oldLesson);
            }
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
            if(lessonsUpdate.stream().noneMatch(l -> l.getId() == lesson.getId())) {
                lesson.setDeleted(true);
            }
        }).collect(Collectors.toList()));

        return oldSection.getLessons();
    }

}
