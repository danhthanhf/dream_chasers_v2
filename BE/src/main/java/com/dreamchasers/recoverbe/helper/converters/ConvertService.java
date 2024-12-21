    package com.dreamchasers.recoverbe.helper.converters;

    import com.dreamchasers.recoverbe.dto.*;
    import com.dreamchasers.recoverbe.entity.CourseKit.*;
    import com.dreamchasers.recoverbe.entity.User.Notification;
    import com.dreamchasers.recoverbe.entity.chat.Chat;
    import com.dreamchasers.recoverbe.entity.chat.Message;
    import com.dreamchasers.recoverbe.entity.chat.UserChat;
    import com.dreamchasers.recoverbe.entity.post.Post;
    import com.dreamchasers.recoverbe.entity.CourseKit.Rating;
    import com.dreamchasers.recoverbe.entity.User.Comment;
    import com.dreamchasers.recoverbe.entity.User.User;
    import com.dreamchasers.recoverbe.enums.CoursePrice;
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
        return ChatDTO.builder()
                .id(chat.getId())
                .recipient(convertToUserBasicDTO(recipient.getUser()))
                .lastMessageTime(chat.getLastMessageTime())
                .isRead(me.isRead())
                .build();
    }

    public MessageDTO convertToMessageDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .sender(convertToUserBasicDTO(message.getSender()))
                .createdAt(message.getCreatedAt())
                .build();
    }

    public List<UserBasicDTO> convertToListUserBasicDTO(List<User> users) {
        return users.stream().map(this::convertToUserBasicDTO).toList();
    }

    public UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .accessToken(user.getAccessToken())
                .role(user.getRole())
                .isInstructor(user.isInstructor())
                .build();
    }

    public RatingDTO convertToRatingDTO(Rating rating) {
        if(rating == null) return null;
        return RatingDTO.builder()
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }

    public StatisticRating convertToStatisticRating(List<Map<Integer, Integer>> map, Page<Rating> ratings) {
        return StatisticRating.builder()
                .rating(ratings)
                .statistic(map)
                .build();
    }

    public List<EnrollmentDTO> convertToListEnrollmentDTO(List<Enrollment> enrollments) {
        return enrollments.stream().map(this::convertToEnrollmentDTO).toList();
    }

    public EnrollmentDTO convertToEnrollmentDTO(Enrollment enrollment) {

        var courseDTO = convertToCourseDTO(enrollment.getCourse());

        List<ProgressDTO> listProgressDTO = enrollment.getProgresses().stream().map(this::convertProgressDTO).collect(Collectors.toList());

        return EnrollmentDTO.builder()
                .isCompleted(enrollment.isCompleted())
                .totalLessons(enrollment.getTotalLessons())
                .totalCompletedLessons(enrollment.getTotalCompletedLessons())
                .course(courseDTO)
                .progresses(listProgressDTO)
                .build();
    }

    public ProgressDTO convertProgressDTO(Progress progress) {
        return ProgressDTO.builder()
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
                .id(section.getId())
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
                .totalRegister(course.getTotalRegister())
                .tier(course.getPrice().name())
                .sections(sectionDTOs)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .totalRating(course.getTotalRating())
                .scoreRating(course.getScoreRating())
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
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .lastOnline(user.getLastOnline())
                .build();
    }

    public Page<NotificationDTO> convertToPageNotificationDTO(Page<Notification> pages) {
        return pages.map(this::convertToNotificationDTO);
    }

    public NotificationDTO convertToNotificationDTO(Notification notification) {
        return NotificationDTO.builder()
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

    public ListNotificationDTO convertToListNotificationDTO(Page<Notification> pages, long totalAllElements, long totalUnReads) {
        Page<NotificationDTO> pageDTO = convertToPageNotificationDTO(pages);
        return ListNotificationDTO.builder()
                .notifications(pageDTO.getContent())
                .totalCurrentElements(pages.getTotalElements())
                .totalAllElements(totalAllElements)
                .totalUnread(totalUnReads)
                .build();
    }

    public List<CommentDTOInCourse> convertToListCommentDTOInCourse(List<Comment> list) {
        return list.stream().map(this::convertToCommentDTOInCourse).toList();
    }

    public CommentDTO convertToCommentDTO (Comment comment) {
        UserBasicDTO user = convertToUserBasicDTO(comment.getAuthor());

        UserBasicDTO repliedUser = convertToUserBasicDTO(comment.getRepliedUser());

        var listSubComments = new ArrayDeque<CommentDTO>();
        if(comment.getReplies() != null) {
            listSubComments = comment.getReplies().stream().filter(c -> !c.isDeleted()).map(this::convertToCommentDTO).collect(Collectors.toCollection(ArrayDeque::new));
        }
        UUID parentId = null;
        if(comment.getParentComment() != null)
            parentId = comment.getParentComment().getId();


        return CommentDTO.builder()
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

    public CommentDTOInCourse convertToCommentDTOInCourse (Comment comment) {
        UserBasicDTO user = convertToUserBasicDTO(comment.getAuthor());
        UserBasicDTO repliedUser = convertToUserBasicDTO(comment.getRepliedUser());

        var listSubComments = new ArrayDeque<CommentDTO>();
        if(comment.getReplies() != null) {
            listSubComments = comment.getReplies().stream().filter(c -> !c.isDeleted()).map(this::convertToCommentDTO).collect(Collectors.toCollection(ArrayDeque::new));
        }
        UUID parentId = null;
        if(comment.getParentComment() != null)
            parentId = comment.getParentComment().getId();


        return CommentDTOInCourse.builder()
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
