package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CoursePostDTO;
import com.dreamchasers.recoverbe.helper.converters.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.entity.CourseKit.QCourse;
import com.dreamchasers.recoverbe.entity.post.Post;
import com.dreamchasers.recoverbe.entity.post.QPost;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoursePostService {
    private final EntityManager entityManager;
    private final ConvertService convertService;



    public ResponseObject getCoursePostByTitle(String title, int page, int size) {
        List<Course> cs = new JPAQuery<Course>(entityManager)
                .from(QCourse.course)
                .where(QCourse.course.title.like("%" + title + "%"))
                .limit((long) page * size + size)
                .fetch();

        List<Post> ps = new JPAQuery<Post>(entityManager)
                .from(QPost.post)
                .where(QPost.post.title.like("%" + title + "%"))
                .limit((long) page * size + size)
                .fetch();

        var listCourses = convertService.convertToListCourseDTO(cs);
        var listPost = convertService.convertToListPostDTO(ps);


        CoursePostDTO coursePostDTO = CoursePostDTO.builder()
                .courses(listCourses)
                .posts(listPost)
                .build();
        return ResponseObject.builder().content(coursePostDTO).status(HttpStatus.OK).build();
    }
}
