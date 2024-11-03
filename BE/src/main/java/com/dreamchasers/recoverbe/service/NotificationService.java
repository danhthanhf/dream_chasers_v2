package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.helper.Handle.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.Notification;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.enums.NotificationType;
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

    public NotificationType getNotificationType(CoursePostStatus status, boolean isCourse) {
        return switch (status) {
            case APPROVED -> isCourse ? NotificationType.COURSE_APPROVED : NotificationType.POST_APPROVED;
            case REJECTED -> isCourse ? NotificationType.COURSE_REJECTED : NotificationType.POST_REJECTED;
            case PUBLISHED -> isCourse ? NotificationType.COURSE_PUBLISHED : NotificationType.POST_PUBLISHED;
            default -> isCourse ? NotificationType.COURSE_PENDING : NotificationType.POST_PENDING;
        };
    }

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
        var noti = notificationRepository.findAllByRecipientEmailAndIsReadOrderByCreatedAtDesc(email, false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(noti).build();
    }

    public ResponseObject removeAllNotificationsByEmail(String email) {
        if(!email.contains("@")) {
            email += "@gmail.com";
        }
        var result = userService.getUserByEmail(email);
        if(result.getContent() == null) return result;
        var user = (User) result.getContent();

        var notifications = notificationRepository.findAllByRecipientEmail(user.getEmail(), PageRequest.of(0, 99999));

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
        var notifications = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(id, PageRequest.of(0, 999999));

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
        var pages = notificationRepository.findAllByRecipientEmail(email, PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
        var totalUnReads = notificationRepository.countByIsReadAndRecipientEmail(false, email);
        var result = convertService.convertToNotificationDTO(pages, email, totalUnReads);
        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .content(result)
                .build();
    }

    public Notification saveNotification (User sender, User recipient, NotificationType type, UUID referenceId, String title, String content, String detailReason) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .content(content)
                .sender(sender)
                .reasonReject(detailReason)
                .referenceId(referenceId)
                .title(title)
                .type(type)
                .build();
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    private void sendToUser(Notification notification, User user) {
        simpMessagingTemplate.convertAndSendToUser(user.getEmail(), "/notification", notification);
    }

    public void sendNotificationToUser(User sender, User recipient, UUID referenceId, NotificationType type, String title, String content, String detailReason) {
        var noti = saveNotification(sender, recipient, type, referenceId, title, content, detailReason);
        sendToUser(noti, recipient);
    }


}
