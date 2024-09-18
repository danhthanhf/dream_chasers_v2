package com.example.demo.repository.data;

import com.example.demo.entity.data.Category;
import com.example.demo.entity.data.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Page<Category> findAllByIsDeleted(boolean isDeleted, Pageable pageable);

    Optional<Category> findByName(String name);

    Page<Category> findByNameContaining(String name, Pageable pageable);

}
