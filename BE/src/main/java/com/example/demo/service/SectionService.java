package com.example.demo.service;

import com.example.demo.dto.CourseDTO;
import com.example.demo.entity.data.*;
import com.example.demo.repository.data.SectionRepository;
import com.example.demo.dto.SectionDTO;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private LessonService lessonService;
    @Autowired
    private final EntityManager entityManager;

    public void addListSectionDtoToCourse(Course course, List<SectionDTO> sectionDTOs) {
        if(course.getSections() == null) course.setSections(new ArrayList<>());
        for (var sectionDTO : sectionDTOs) {
            var section = Section.builder()
                    .title(sectionDTO.getTitle())
                    .course(course)
                    .lessons(sectionDTO.getLessons())
                    .build();
            course.getSections().add(section);
            sectionRepository.save(section);
        }
    }

    public List<Section> getSectionsByCourse(Course course) {
        var sectionIds = course.getSections().stream().map(Section::getId).toList();
        return new JPAQuery<Section>(entityManager)
                .from(QSection.section)
                .join(QSection.section.lessons, QLesson.lesson).fetchJoin()
                .where(QSection.section.id.in(sectionIds).and(QLesson.lesson.isDeleted.eq(false)))
                .fetch();
    }

    public void removeSections(List<Section> sections, boolean isDeleted) {
        List<Integer> sectionIds =  sections.stream().map(Section::getId).toList();
        lessonService.removeLessonsOfSections(sectionIds, true);
        sectionRepository.markSectionsAsDeleted(sectionIds, isDeleted);
    }


    public void updateSections(CourseDTO courseDTO, Course course) {
        if(courseDTO.getSections().isEmpty()) {
            if(course.getSections() == null || course.getSections().isEmpty()) return;
            removeSections(course.getSections(), true);
        }

        var updateSections = new ArrayList<Section>();
        for(var sectionDTO : courseDTO.getSections()) {
            Section section;
            if(sectionDTO.getId() == 0) {
                section = Section.builder()
                        .course(course)
                        .title(sectionDTO.getTitle())
                        .build();
                course.getSections().add(section);
            }
            else {
                section = sectionRepository.findById(sectionDTO.getId()).orElse(null);
                if(section != null) {
                    section.setTitle(sectionDTO.getTitle());
                    var lessons = lessonService.updateLessonsOfSection(section, sectionDTO);
                    section.setLessons(lessons);
                }
            }

            updateSections.add(section);
        }

        course.getSections().forEach(section -> {
            if(!updateSections.contains(section)) {
                section.setDeleted(true);
            }
        });
        updateSections.addAll(course.getSections());
        sectionRepository.saveAll(updateSections);
    }

}
