package com.danhthanhf.distantclass.repository;

import com.danhthanhf.distantclass.entity.User.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {
    Note findByTimeAndLessonId(int time, UUID lessonId);
}
