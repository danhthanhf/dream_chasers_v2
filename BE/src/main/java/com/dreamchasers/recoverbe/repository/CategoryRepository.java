package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.CourseKit.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findCategoryByName(String name);

    List<Category> findAllByNameIn(List<String> names);

    Page<Category> findAllByDeleted(boolean isDeleted, Pageable pageable);

    Page<Category> findByNameContaining(String name, Pageable pageable);

    Optional<Category> findByName(String name);

    @Query("SELECT COUNT(*) FROM Course co JOIN co.categories c where c.id = :categoryId")
    long existCourseByCategoryId(UUID categoryId);


}
