    package com.danhthanhf.distantclass.common.converter;

    import com.danhthanhf.distantclass.entity.CourseKit.Section;
    import com.danhthanhf.distantclass.entity.chat.UserChat;
    import com.danhthanhf.distantclass.common.enums.CoursePrice;
    import com.danhthanhf.distantclass.dto.ChatDTO;
    import lombok.NoArgsConstructor;
    import org.springframework.data.domain.Page;
    import org.springframework.stereotype.Component;

    import java.util.*;
    import java.util.stream.Collectors;

@NoArgsConstructor
@Component
public class ConvertService {

    public ChatDTO convertToChatDTO(Chat chat, User currentUser) {
        UserChat me = null, recipient = null;

        for(UserChat userChat : chat.getParticipants()) {
            if(userChat.getUser().equals(currentUser)) {
                me = userChat;
            } else {
                recipient = userChat;
            }
        }

        assert recipient != null;
        assert me != null;
        return com.danhthanhf.distantclass.dto.ChatDTO.builder()
                .id(chat.getId())
                .recipient(convertToUserBasicDTO(recipient.getUser()))
                .lastMessageTime(chat.getLastMessageTime())
                .isRead(me.isRead())
                .build();
    }

    public com.danhthanhf.distantclass.dto.MessageDTO convertToMessageDTO(Message message) {
        return com.danhthanhf.distantclass.dto.MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .sender(convertToUserBasicDTO(message.getSender()))
                .createdAt(message.getCreatedAt())
                .build();
    }

    public List<com.danhthanhf.distantclass.dto.UserBasicDTO> convertToListUserBasicDTO(List<User> users) {
        return users.stream().map(this::convertToUserBasicDTO).toList();
    }

    public com.danhthanhf.distantclass.dto.UserDTO convertToUserDTO(User user) {
        return com.danhthanhf.distantclass.dto.UserDTO.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .accessToken(user.getAccessToken())
                .role(user.getRole())
                .isInstructor(user.isInstructor())
                .build();
    }

    public com.danhthanhf.distantclass.dto.RatingDTO convertToRatingDTO(Rating rating) {
        if(rating == null) return null;
        return com.danhthanhf.distantclass.dto.RatingDTO.builder()
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }

    public com.danhthanhf.distantclass.dto.StatisticRating convertToStatisticRating(List<Map<Integer, Integer>> map, Page<Rating> ratings) {
        return com.danhthanhf.distantclass.dto.StatisticRating.builder()
                .rating(ratings)
                .statistic(map)
                .build();
    }

    public List<com.danhthanhf.distantclass.dto.EnrollmentDTO> convertToListEnrollmentDTO(List<com.danhthanhf.distantclass.entity.CourseKit.Enrollment> enrollments) {
        return enrollments.stream().map(this::convertToEnrollmentDTO).toList();
    }

    public com.danhthanhf.distantclass.dto.EnrollmentDTO convertToEnrollmentDTO(com.danhthanhf.distantclass.entity.CourseKit.Enrollment enrollment) {

        var courseDTO = convertToCourseDTO(enrollment.getCourse());

        List<com.danhthanhf.distantclass.dto.ProgressDTO> listProgressDTO = enrollment.getProgresses().stream().map(this::convertProgressDTO).collect(Collectors.toList());

        return com.danhthanhf.distantclass.dto.EnrollmentDTO.builder()
                .isCompleted(enrollment.isCompleted())
                .totalLessons(enrollment.getTotalLessons())
                .totalCompletedLessons(enrollment.getTotalCompletedLessons())
                .course(courseDTO)
                .progresses(listProgressDTO)
                .build();
    }

    public ProgressDTO convertProgressDTO(com.danhthanhf.distantclass.entity.CourseKit.Progress progress) {
        return com.danhthanhf.distantclass.dto.ProgressDTO.builder()
                .isCompleted(progress.isCompleted())
                .lessonId(progress.getLesson().getId())
                .timeStamp(progress.getTimeStamp())
                .isLocked(progress.isLocked())
                .duration(progress.getDuration())
                .build();
    }

    public Page<PostDTO> convertToPagePostDTO(Page<Post> posts) {
        return posts.map(this::convertToPostDTO);
    }

    public List<com.danhthanhf.distantclass.dto.CoursePriceDTO> convertToListCoursePriceDTO() {
        return Arrays.stream(CoursePrice.values()).map(coursePrice -> com.danhthanhf.distantclass.dto.CoursePriceDTO.builder()
                .name(coursePrice.name())
                .value(coursePrice.getPrice())
                .build()).toList();
    }

    public com.danhthanhf.distantclass.dto.PostDTO convertToPostDTO (Post post) {
        return com.danhthanhf.distantclass.dto.PostDTO.builder()
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

    public List<com.danhthanhf.distantclass.dto.PostDTO> convertToListPostDTO (List<Post> posts) {
        return posts.stream().map(this::convertToPostDTO).toList();
    }

    public SectionDTO convertToSectionDTO(Section section) {
        return com.danhthanhf.distantclass.dto.SectionDTO.builder()
                .id(section.getId())
                .title(section.getTitle())
                .totalDuration(section.getTotalDuration())
                .lessons(section.getLessons())
                .build();
    }

    public com.danhthanhf.distantclass.dto.CourseDTO convertToCourseAndCheckEnrollmentDTO(com.danhthanhf.distantclass.entity.CourseKit.Course course, boolean isEnrolled) {
        com.danhthanhf.distantclass.dto.CourseDTO courseDTO = convertToCourseDTO(course);
        courseDTO.setEnrolled(isEnrolled);
        return courseDTO;
    }

    public com.danhthanhf.distantclass.dto.CourseDTO convertToCourseDTO(com.danhthanhf.distantclass.entity.CourseKit.Course course) {
        List<com.danhthanhf.distantclass.dto.SectionDTO> sectionDTOs = course.getSections().stream().map(this::convertToSectionDTO).toList();
        List<String> ctes = course.getCategories().stream().map(com.danhthanhf.distantclass.entity.CourseKit.Category::getName).toList();
        return com.danhthanhf.distantclass.dto.CourseDTO.builder()
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
                .totalRegister(course.getTotalRegister())
                .tier(course.getPrice().name())
                .sections(sectionDTOs)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .totalRating(course.getTotalRating())
                .scoreRating(course.getScoreRating())
                .build();
    }

    public List<com.danhthanhf.distantclass.dto.CourseDTO> convertToListCourseDTO(List<com.danhthanhf.distantclass.entity.CourseKit.Course> courses) {
        return courses.stream().map(this::convertToCourseDTO).toList();
    }

    public Page<com.danhthanhf.distantclass.dto.CourseDTO> convertToPageCourseDTO(Page<com.danhthanhf.distantclass.entity.CourseKit.Course> courses) {
        return courses.map(this::convertToCourseDTO);
    }

    public com.danhthanhf.distantclass.dto.UserBasicDTO convertToUserBasicDTO(User user) {
        if(user == null) return null;

        return com.danhthanhf.distantclass.dto.UserBasicDTO.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .lastOnline(user.getLastOnline())
                .build();
    }

    public Page<com.danhthanhf.distantclass.dto.NotificationDTO> convertToPageNotificationDTO(Page<Notification> pages) {
        return pages.map(this::convertToNotificationDTO);
    }

    public com.danhthanhf.distantclass.dto.NotificationDTO convertToNotificationDTO(Notification notification) {
        return com.danhthanhf.distantclass.dto.NotificationDTO.builder()
                .author(convertToUserBasicDTO(notification.getSender()))
                .content(notification.getContent())
                .createdAt(notification.getCreatedAt())
                .type(notification.getType())
                .id(notification.getId())
                .title(notification.getTitle())
                .referenceType(notification.getReferenceType())
                .isRead(notification.isRead())
                .postTitle(notification.getPostTitle())
                .lessonId(notification.getLessonId())
                .courseId(notification.getCourseId())
                .commentId(notification.getCommentId())
                .sender(convertToUserBasicDTO(notification.getSender()))
                .build();
    }

    public com.danhthanhf.distantclass.dto.ListNotificationDTO convertToListNotificationDTO(Page<Notification> pages, long totalAllElements, long totalUnReads) {
        Page<com.danhthanhf.distantclass.dto.NotificationDTO> pageDTO = convertToPageNotificationDTO(pages);
        return com.danhthanhf.distantclass.dto.ListNotificationDTO.builder()
                .notifications(pageDTO.getContent())
                .totalCurrentElements(pages.getTotalElements())
                .totalAllElements(totalAllElements)
                .totalUnread(totalUnReads)
                .build();
    }

    public List<com.danhthanhf.distantclass.dto.CommentDTOInCourse> convertToListCommentDTOInCourse(List<Comment> list) {
        return list.stream().map(this::convertToCommentDTOInCourse).toList();
    }

    public com.danhthanhf.distantclass.dto.CommentDTO convertToCommentDTO (Comment comment) {
        com.danhthanhf.distantclass.dto.UserBasicDTO user = convertToUserBasicDTO(comment.getAuthor());

        com.danhthanhf.distantclass.dto.UserBasicDTO repliedUser = convertToUserBasicDTO(comment.getRepliedUser());

        var listSubComments = new ArrayDeque<com.danhthanhf.distantclass.dto.CommentDTO>();
        if(comment.getReplies() != null) {
            listSubComments = comment.getReplies().stream().filter(c -> !c.isDeleted()).map(this::convertToCommentDTO).collect(Collectors.toCollection(ArrayDeque::new));
        }
        UUID parentId = null;
        if(comment.getParentComment() != null)
            parentId = comment.getParentComment().getId();


        return com.danhthanhf.distantclass.dto.CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(user)
                .title(comment.getTitle())
                .repliedUser(repliedUser)
                .createdAt(comment.getCreatedAt())
                .parentId(parentId)
                .replies(listSubComments)
                .build();
    }

    public com.danhthanhf.distantclass.dto.CommentDTOInCourse convertToCommentDTOInCourse (Comment comment) {
        com.danhthanhf.distantclass.dto.UserBasicDTO user = convertToUserBasicDTO(comment.getAuthor());
        com.danhthanhf.distantclass.dto.UserBasicDTO repliedUser = convertToUserBasicDTO(comment.getRepliedUser());

        var listSubComments = new ArrayDeque<com.danhthanhf.distantclass.dto.CommentDTO>();
        if(comment.getReplies() != null) {
            listSubComments = comment.getReplies().stream().filter(c -> !c.isDeleted()).map(this::convertToCommentDTO).collect(Collectors.toCollection(ArrayDeque::new));
        }
        UUID parentId = null;
        if(comment.getParentComment() != null)
            parentId = comment.getParentComment().getId();


        return com.danhthanhf.distantclass.dto.CommentDTOInCourse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(user)
                .lessonId(comment.getLessonId())
                .title(comment.getTitle())
                .repliedUser(repliedUser)
                .createdAt(comment.getCreatedAt())
                .parentId(parentId)
                .replies(listSubComments)
                .build();
    }

}
