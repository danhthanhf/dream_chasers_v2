package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.dto.SectionDTO;
import com.dreamchasers.recoverbe.entity.CourseKit.*;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.repository.SectionRepository;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SectionService {
    private final SectionRepository sectionRepository;
    private final LessonService lessonService;
    private final EntityManager entityManager;

    public List<Section> createListSectionFromDTO(List<SectionDTO> sections) {
        if (sections == null || sections.isEmpty()) return null;

        List<Section> result = new ArrayList<>();

        for(var sectionDTO : sections) {
            var section = Section.builder()
                    .title(sectionDTO.getTitle())
                    .lessons(sectionDTO.getLessons())
                    .build();
            if(sectionDTO.getLessons() == null || sectionDTO.getLessons().isEmpty())
                continue;

            var totalDuration = sectionDTO.getLessons().stream().mapToInt(Lesson::getDuration).sum();
            section.setTotalDuration(totalDuration);

            result.add(section);
        }
        return result;
    }
    public void updateSections(CourseDTO courseDTO, Course course) {
        if(courseDTO.getSections().isEmpty()) {
            if(course.getSections() == null || course.getSections().isEmpty()) return;

            sectionRepository.deleteAll(course.getSections());
            course.setSections(null);
            return;
        }

        var updateSections = new ArrayList<Section>();
        for(var sectionDTO : courseDTO.getSections()) {

            Section section = sectionRepository.findById(sectionDTO.getId()).orElse(null);

            if(section == null) {
                section = Section.builder()
                        .title(sectionDTO.getTitle())
                        .lessons(sectionDTO.getLessons())
                        .build();
                course.getSections().add(section);
                updateSections.add(section);
            }
            else {
                    section.setTitle(sectionDTO.getTitle());
                    var lessons = lessonService.updateLessonsOfSection(section, sectionDTO);
                    section.setLessons(lessons);
                    updateSections.add(section);
            }

            assert section != null;
            sectionRepository.save(section);
        }

        course.getSections().forEach(section -> {
            if(!updateSections.contains(section)) {
                sectionRepository.delete(section);
            }
        });
    }


    public List<Section> getSectionsByCourse(Course course) {
        var sectionIds = course.getSections().stream().map(Section::getId).toList();
        return new JPAQuery<Section>(entityManager)
                .from(QSection.section)
                .join(QSection.section.lessons, QLesson.lesson).fetchJoin()
                .where(QSection.section.id.in(sectionIds).and(QLesson.lesson.deleted.eq(false)))
                .fetch();
    }

}
