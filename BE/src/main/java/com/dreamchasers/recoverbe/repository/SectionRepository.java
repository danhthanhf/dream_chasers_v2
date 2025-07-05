package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.CourseKit.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
}
