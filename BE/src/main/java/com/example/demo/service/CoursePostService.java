package com.example.demo.service;

import com.example.demo.dto.CoursePostDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.*;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoursePostService {
    private final EntityManager entityManager;

    @Autowired
    public CoursePostService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public ResponseObject getCoursePostByTitle(String title, int page, int size) {
        List<Course> cs = new JPAQuery<Course>(entityManager)
                .from(QCourse.course)
                .where(QCourse.course.title.like("%" + title + "%")
                        .and(QCourse.course.isDeleted.eq(false)))
                .limit((long) page * size + size)
                .fetch();

        List<Post> ps = new JPAQuery<Post>(entityManager)
                .from(QPost.post)
                .where(QPost.post.title.like("%" + title + "%")
                        .and(QPost.post.isDeleted.eq(false)
                                .and(QPost.post.status.eq(PostStatus.APPROVED))
                        ))
                .limit((long) page * size + size)
                .fetch();


        CoursePostDTO coursePostDTO = CoursePostDTO.builder()
                .courses(cs)
                .posts(ps)
                .build();

        return ResponseObject.builder().content(coursePostDTO).status(HttpStatus.OK).build();
    }
}
