package com.example.demo.service;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.UsersAndRoles;
import com.example.demo.entity.data.*;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private UserRepository userRepository;
    private TagService tagService;
    private EntityManager entityManager;

    @Autowired
    public UserService(UserRepository userRepository, TagService tagService, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.tagService = tagService;
        this.entityManager = entityManager;
    }

    public ResponseObject getCourses(String email) {
        var user = getUserByEmail(email);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        List<Course> courses = new JPAQuery<Course>(entityManager).from(QCourse.course)
                .innerJoin(QProgress.progress).on(QCourse.course.id.eq(QProgress.progress.course.id))
                .where(QProgress.progress.user.id.eq(user.getId()))
                .fetch();
        return ResponseObject.builder().status(HttpStatus.OK).content(courses).build();
    }



    public ResponseObject getPostById(String email, int postId) {
        var user = getUserByEmail(email);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        var post = new JPAQuery<Post>(entityManager)
                .from(QPost.post)
                .where(QPost.post.user.id.eq(user.getId()).and(QPost.post.id.eq(postId)).and(QPost.post.isDeleted.eq(false)))
                .fetchFirst();
        return ResponseObject.builder().status(HttpStatus.OK).content(post).build();
    }

//    public ResponseObject getPosts(String email, boolean deleted, int page, int size) {
//        var user = getUserByEmail(email);
//        if (user == null) {
//            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
//        }
//        var posts = user.getPosts().stream().filter(post -> post.getDeleted() == deleted).limit((long) page * size + size).toList();
//        return ResponseObject.builder().status(HttpStatus.OK).content(posts).build();
//    }

    public void save(User user) {
        userRepository.save(user);
    }

    public boolean isPostFavorite(String email, Post post) {
        var user = getUserByEmail(email);
        if (user == null) {
            return false;
        }
        return user.getFavoritePosts().contains(post);
    }

    public ResponseObject toggleFavoritePost(String email, int postId) {
        var remove = false;
        var user = getUserByEmail(email);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        var post = entityManager.find(Post.class, postId);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Post not found").build();
        }
        if (user.getFavoritePosts().contains(post)) {
            user.getFavoritePosts().remove(post);
            remove = true;

        } else {
            user.getFavoritePosts().add(post);
        }
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess(!remove ? "Add to bookmarks":"Remove to bookmarks").build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public ResponseObject createPost(Post post, String email) {
        var user = getUserByEmail(email);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
        }
        post.setUser(user);
        post.setTags(tagService.saveTags(post.getTags()));
//        user.getPosts().add(post);
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Publish post successfully").build();
    }

//    public ResponseObject updatePost(Post post, String email) {
//        var user = getUserByEmail(email);
//        if (user == null) {
//            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
//        }
//
//        var existPost = user.getPosts().stream().filter(p -> p.getId() == post.getId()).findFirst();
//        if (existPost.isEmpty()) {
//            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Post not found").build();
//        }
//
//        existPost.get().setContent(post.getContent());
//        existPost.get().setTitle(post.getTitle());
//        userRepository.save(user);
//        return ResponseObject.builder().status(HttpStatus.OK).mess("Publish post successfully").build();
//    }


    public ResponseObject getAllUserAndRole(boolean isDeleted){
        var roles = Role.values();
        var users = userRepository.findAllByIsDeleted(isDeleted, PageRequest.of(0, 5));
        UsersAndRoles usersAndRoles = UsersAndRoles.builder().roles(roles).users(users).build();
        return ResponseObject.builder().status(HttpStatus.OK).content(usersAndRoles).build();
    }

    public ResponseObject getUserByRole(String role, int page, int size) {
        if (Objects.equals(role, "All"))
            return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findAll(PageRequest.of(page, size))).build();
        return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findByRole(role, PageRequest.of(page, size))).build();
    }

    public ResponseObject getUserByName(String name, boolean isDelete, int page, int size) {
        if (Objects.equals(name, ""))
            return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findAllByIsDeleted(isDelete, PageRequest.of(page, size))).build();
        return ResponseObject.builder().status(HttpStatus.OK)
                .content(userRepository.findByFirstNameContainingOrLastNameContainingAndAndDeleted(name, name,isDelete, PageRequest.of(page, size)))
                .build();
    }

    public ResponseObject getAllByPage(int page, int size) {
        var result = userRepository.findAllByIsDeleted(false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject getAllDeletedByPage(int page, int size) {
        var result = userRepository.findAllByIsDeleted(true, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject softDelete(int id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        if (Objects.equals(user.getRole(), Role.ADMIN) || user.getRole() == Role.MANAGER)
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Cannot delete this user").build();
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject hardDelete(int id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        userRepository.delete(user);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject restoreUserById(int id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null)
            return ResponseObject.builder().mess("Course does not exist").status(HttpStatus.BAD_REQUEST).build();
        user.setDeleted(false);
        userRepository.save(user);
        return ResponseObject.builder().mess("Restore successfully").status(HttpStatus.OK).build();
    }
}
