package com.example.demo.repository.data;

import com.example.demo.entity.data.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query(value = "SELECT t.name FROM Tag t WHERE t.name IN (:names)", nativeQuery = true)
    List<String> findExistTagNames(List<String> names);

}
