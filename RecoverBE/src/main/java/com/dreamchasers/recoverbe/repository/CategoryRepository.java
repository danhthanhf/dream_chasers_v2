package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.CourseKit.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findCategoryByName(String name);
    List<Category> findCategoriesByNameIn(List<String> names);

    Page<Category> findAllByDeleted(boolean isDeleted, Pageable pageable);

    Category findByName(String name);
}
