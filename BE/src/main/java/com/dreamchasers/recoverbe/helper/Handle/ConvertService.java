package com.dreamchasers.recoverbe.helper.Handle;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.dto.NotificationDTO;
import com.dreamchasers.recoverbe.dto.UserBasicDTO;
import com.dreamchasers.recoverbe.model.Notification;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.model.User.User;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.UUID;
import java.util.stream.Collectors;

@NoArgsConstructor
@Component
public class ConvertService {
    public UserBasicDTO convertUserBasicDTO(User user) {
        if(user == null) return null;

        return UserBasicDTO.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public NotificationDTO convertToNotificationDTO(Page<Notification> pages, String email, int totalUnReads) {
        return NotificationDTO.builder()
                .notifications(pages.getContent())
                .totalElements(pages.getTotalElements())
                .totalUnread(totalUnReads)
                .build();
    }

    public CommentDTO convertToCommentDTO (Comment comment) {
        UserBasicDTO user = convertUserBasicDTO(comment.getAuthor());
        UserBasicDTO repliedUser = convertUserBasicDTO(comment.getRepliedUser());

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
