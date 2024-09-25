package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.SectionDTO;
import com.dreamchasers.recoverbe.model.CourseKit.Section;
import com.dreamchasers.recoverbe.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SectionService {
    private final SectionRepository sectionRepository;

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
}
