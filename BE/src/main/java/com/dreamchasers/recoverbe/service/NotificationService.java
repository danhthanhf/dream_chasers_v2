package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.helper.Handle.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.model.Notification;
import com.dreamchasers.recoverbe.model.Post.Post;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.NotificationRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;
    private final ConvertService convertService;
    private final EntityManager entityManager;


    public Notification readNotification(UUID id) {
        var notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return null;
        }
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public ResponseObject readNotification(String email, UUID id) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var user = userService.findByEmail(email);

        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not found ").build();
        }
        var result = readNotification(id);
        if (result == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("Error while read notification").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).message("Read notification successfully").content(result).build();
    }

    public ResponseObject getAllUnread(String email, int page, int size) {
        var result = userService.getUserByEmail(email);
        if(result.getContent() == null) return result;
        var user = (User) result.getContent();
        var noti = notificationRepository.findAllByUserEmailAndIsReadOrderByCreatedAtDesc(email, false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(noti).build();
    }

    public ResponseObject removeAllNotificationsByEmail(String email) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var result = userService.getUserByEmail(email);
        if(result.getContent() == null) return result;
        var user = (User) result.getContent();

        var notifications = notificationRepository.findAllByUserEmail(user.getEmail(), PageRequest.of(0, 99999));

        if (notifications == null) {
            return ResponseObject.builder().status(HttpStatus.NO_CONTENT).message("Remove all notification successfully").build();

        }
        notificationRepository.deleteAll(notifications);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).message("Remove all notification successfully").build();
    }

    public ResponseObject readAllNotification(String email) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var user = userService.findByEmail(email);

        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not found ").build();
        }
        var result = readAllNotification(user.getId());
        if (result == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("Error while read notification").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject readAllNotification(UUID id) {
        var notifications = notificationRepository.findAllByUserIdOrderByCreatedAtDesc(id, PageRequest.of(0, 999999));

        if (notifications == null) {
            return null;
        }
        for (var notification : notifications ) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
        return ResponseObject.builder()
                .status(HttpStatus.NO_CONTENT)
                .build();
    }


    public ResponseObject getAll(String email, int page, int size) {
        var pages = notificationRepository.findAllByUserEmail(email, PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
        var totalUnReads = notificationRepository.countByIsReadAndUserEmail(false, email);
        var result = convertService.convertToNotificationDTO(pages, email, totalUnReads);
        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .content(result)
                .build();
    }

    public Notification saveNotification (User fromUser, User toUser, String description, String titleContent, String path, UUID commentId) {
        var from = "ADMIN";
        if (fromUser != null) {
            from = fromUser.getFirstName() + " " + fromUser.getLastName();
        }
        Notification notification = Notification.builder()
                .user(toUser)
                .commentId(commentId)
                .fromUser(from)
                .img(fromUser != null ? fromUser.getAvatarUrl() : null)
                .content(description)
                .TitleContent(titleContent)
                .path(path)
                .build();
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public void sendToUser(Notification notification, User user) {
        simpMessagingTemplate.convertAndSendToUser(user.getEmail(), "/notification", notification);
    }

    public void saveAndSendToUser(User fromUser, User toUser, String description, String titleContent, String path, UUID commentId) {
        var noti = saveNotification(fromUser, toUser, description, titleContent, path, commentId);
        sendToUser(noti, toUser);
    }


    public void adminSendProcessDataPost(User toUser, Post post) {
        var noti = saveNotification( null, toUser, "Admin has " + post.getStatus() + " your post", post.getTitle(), post.getTitle(), post.getId());
        simpMessagingTemplate.convertAndSendToUser(toUser.getEmail(), "/notification", noti);
    }

}
