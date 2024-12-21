package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.entity.User.Note;
import com.dreamchasers.recoverbe.entity.User.QNote;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.repository.LessonRepository;
import com.dreamchasers.recoverbe.repository.NoteRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;
    private final JPAQueryFactory queryFactory;
    private final LessonRepository lessonRepository;

    public ResponseObject getByTime(UUID lessonId, int time) {
        var note = noteRepository.findByTimeAndLessonId(time, lessonId);
        return ResponseObject.builder().status(HttpStatus.OK).content(note).build();
    }

    public ResponseObject getAllFilter(UUID courseId, UUID lessonId, String orderBy, int page, int size) {
        BooleanBuilder builder = new BooleanBuilder();
        var qnote = QNote.note;
        JPAQuery<Note> query = null;
        List<Note> result = null;
        int totalElements;

        if(lessonId != null) {
            builder.and(qnote.lesson.id.eq(lessonId));
        }
        else {
            builder.and(qnote.courseId.eq(courseId));
        }

        if(orderBy != null){
            if(orderBy.equals("asc"))
                query = queryFactory.selectFrom(qnote).where(builder).orderBy(qnote.createdAt.asc());
            else
                query = queryFactory.selectFrom(qnote).where(builder).orderBy(qnote.createdAt.desc());
        }

        assert query != null;
        totalElements = query.fetch().size();
        result = query.offset((long) page * size).limit(size).fetch();

        return ResponseObject.builder().status(HttpStatus.OK).content(new PageImpl<>(result, PageRequest.of(page, size), totalElements)).build();
    }

    public ResponseObject save(UUID courseId, UUID lessonId, Note newNote) {
        var note = noteRepository.findByTimeAndLessonId(newNote.getTime(), lessonId);
        var lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new EntityNotFoundException("Lesson not found"));
        if(note != null) {
            note.setLesson(lesson);
            note.setCourseId(courseId);
        }
        else {
            note = newNote;
            note.setLesson(lesson);
            note.setCourseId(courseId);
        }
        noteRepository.save(note);
        return ResponseObject.builder().status(HttpStatus.CREATED).content(note).build();
    }

    public ResponseObject update(UUID id, Note note) {
        noteRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Note not found"));
        noteRepository.save(note);
        return ResponseObject.builder().status(HttpStatus.OK).content(note).message("Note updated").build();
    }

    public void delete(UUID id)
    {
        noteRepository.deleteById(id);
    }
}
