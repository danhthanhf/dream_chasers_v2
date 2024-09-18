package com.example.demo.repository.data;

import com.example.demo.entity.data.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
    @Modifying
    @Query(value = "UPDATE Section s SET s.isDeleted = :isDeleted WHERE s.id in :sectionIds", nativeQuery = true)
    void markSectionsAsDeleted(List<Integer> sectionIds, boolean isDeleted);

}
