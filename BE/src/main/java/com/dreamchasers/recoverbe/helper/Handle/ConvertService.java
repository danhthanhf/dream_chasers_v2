package com.dreamchasers.recoverbe.helper.Handle;

import com.dreamchasers.recoverbe.dto.*;
import com.dreamchasers.recoverbe.entity.CourseKit.Category;
import com.dreamchasers.recoverbe.entity.CourseKit.Course;
import com.dreamchasers.recoverbe.entity.CourseKit.Section;
import com.dreamchasers.recoverbe.entity.Notification;
import com.dreamchasers.recoverbe.entity.Post.Post;
import com.dreamchasers.recoverbe.entity.User.Comment;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.CoursePrice;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@NoArgsConstructor
@Component
public class ConvertService {

    public Page<PostDTO> convertToPagePostDTO(Page<Post> posts) {
        return posts.map(this::convertToPostDTO);
    }

    public List<CoursePriceDTO> convertToListCoursePriceDTO() {
        return Arrays.stream(CoursePrice.values()).map(coursePrice -> CoursePriceDTO.builder()
                .name(coursePrice.name())
                .value(coursePrice.getPrice())
                .build()).toList();
    }

    public PostDTO convertToPostDTO (Post post) {
        return PostDTO.builder()
                .title(post.getTitle())
                .views(post.getViews())
                .totalComment(post.getTotalComment())
                .likes(post.getLikes())
                .thumbnail(post.getThumbnail())
                .description(post.getDescription())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .reasonReject(post.getReasonReject())
                .status(post.getStatus())
                .userAvatar(post.getUser().getAvatarUrl())
                .userName(post.getUser().getFirstName() + " " + post.getUser().getLastName())
                .build();
    }

    public List<PostDTO> convertToListPostDTO (List<Post> posts) {
        return posts.stream().map(this::convertToPostDTO).toList();
    }


    public SectionDTO convertToSectionDTO(Section section) {
        return SectionDTO.builder()
                .title(section.getTitle())
                .totalDuration(section.getTotalDuration())
                .lessons(section.getLessons())
                .build();
    }

    public CourseDTO convertToCourseAndCheckEnrollmentDTO(Course course, boolean isEnrolled) {
        CourseDTO courseDTO = convertToCourseDTO(course);
        courseDTO.setEnrolled(isEnrolled);
        return courseDTO;
    }

    public CourseDTO convertToCourseDTO(Course course) {
        List<SectionDTO> sectionDTOs = course.getSections().stream().map(this::convertToSectionDTO).toList();
        List<String> ctes = course.getCategories().stream().map(Category::getName).toList();
        return CourseDTO.builder()
                .id(course.getId())
                .price(course.getPrice().getPrice())
                .totalDuration(course.getTotalDuration())
                .title(course.getTitle())
                .status(course.getStatus())
                .author(convertToUserBasicDTO(course.getAuthor()))
                .categories(ctes)
                .description(course.getDescription())
                .video(course.getVideo())
                .thumbnail(course.getThumbnail())
                .discount(course.getDiscount())
                .tier(course.getPrice().name())
                .sections(sectionDTOs)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    public List<CourseDTO> convertToListCourseDTO(List<Course> courses) {
        return courses.stream().map(this::convertToCourseDTO).toList();
    }

    public Page<CourseDTO> convertToPageCourseDTO(Page<Course> courses) {
        return courses.map(this::convertToCourseDTO);
    }

    public UserBasicDTO convertToUserBasicDTO(User user) {
        if(user == null) return null;

        return UserBasicDTO.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public ListNotificationDTO convertToNotificationDTO(Page<Notification> pages, String email, int totalUnReads) {
        return ListNotificationDTO.builder()
                .notifications(pages.getContent())
                .totalElements(pages.getTotalElements())
                .totalUnread(totalUnReads)
                .build();
    }

    public CommentDTO convertToCommentDTO (Comment comment) {
        UserBasicDTO user = convertToUserBasicDTO(comment.getAuthor());
        UserBasicDTO repliedUser = convertToUserBasicDTO(comment.getRepliedUser());

        var listSubComments = new ArrayDeque<CommentDTO>();
        if(comment.getReplies() != null) {
            listSubComments = comment.getReplies().stream().map(this::convertToCommentDTO).collect(Collectors.toCollection(ArrayDeque::new));
        }
        UUID parentId = null;
        if(comment.getParentComment() != null)
            parentId = comment.getParentComment().getId();


        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(user)
                .repliedUser(repliedUser)
                .createdAt(comment.getCreatedAt())
                .parentId(parentId)
                .replies(listSubComments)
                .build();
    }

}
