package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CourseDTO;
import com.dreamchasers.recoverbe.dto.SectionDTO;
import com.dreamchasers.recoverbe.model.CourseKit.Course;
import com.dreamchasers.recoverbe.model.CourseKit.QLesson;
import com.dreamchasers.recoverbe.model.CourseKit.QSection;
import com.dreamchasers.recoverbe.model.CourseKit.Section;
import com.dreamchasers.recoverbe.repository.SectionRepository;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SectionService {
    private final SectionRepository sectionRepository;
    private final LessonService lessonService;
    private final EntityManager entityManager;

    public List<Section> createListSectionFromDTO(List<SectionDTO> sections) {
        List<Section> result = new ArrayList<>();
        for(var sectionDTO : sections) {
            var section = Section.builder()
                    .title(sectionDTO.getTitle())
                    .lessons(sectionDTO.getLessons())
                    .build();
            result.add(section);
        }
        return result;
    }
    public void updateSections(CourseDTO courseDTO, Course course) {
        if(courseDTO.getSections().isEmpty()) {
            if(course.getSections() == null || course.getSections().isEmpty()) return;
            else {
                course.getSections().forEach(section -> {
                    section.setDeleted(true);
                    sectionRepository.save(section);
                });
                return;
            }
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
                section.setDeleted(true);
                sectionRepository.save(section);
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
