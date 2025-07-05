package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.entity.User.QNotification;
import com.dreamchasers.recoverbe.enums.ReferenceType;
import com.dreamchasers.recoverbe.helper.converters.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.User.Notification;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.enums.NotificationType;
import com.dreamchasers.recoverbe.repository.NotificationRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryFactory;
import com.querydsl.core.QueryResults;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;
    private final ConvertService convertService;
    private final JPAQueryFactory jpaQueryFactory;

    public Notification save(Notification noti) {
        return notificationRepository.save(noti);
    }

    public ResponseObject addFriend(String email) {
        User recipient = userService.getByEmail(email);
        var sender = userService.getCurrentUser();
        if(Objects.equals(email, sender.getEmail())) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Can't add yourself").build();
        }
        sendRequestAddFriend(sender, recipient);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public void sendRequestAddFriend(User sender, User recipient) {
        var noti = Notification.builder()
                .title("Send you a request to add friend")
                .sender(sender)
                .content(sender.getFirstName() + " " + sender.getLastName() + " send you a request to add friend")
                .type(NotificationType.ADD_FRIEND)
                .recipient(recipient)
                .referenceType(ReferenceType.ADD_FRIEND)
                .build();
        save(noti);
        sendToUser(noti, recipient);
    }

    public void sendToPostAuthor(User sender, User postAuThor, ReferenceType referenceType, UUID commentId, String postTile) {
        if(Objects.equals(sender.getEmail(), postAuThor.getEmail())) return;
        var notification = Notification.builder()
                .recipient(postAuThor)
                .sender(sender)
                .commentId(commentId)
                .title(postTile)
                .postTitle(postTile)
                .referenceType(referenceType)
                .content("You have a new comment in your post")
                .type(NotificationType.ADD_FRIEND)
                .build();

        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
        sendToUser(notification, postAuThor);
    }

    public NotificationType getNotificationType(CoursePostStatus status, boolean isCourse) {
        return switch (status) {
            case APPROVED -> isCourse ? NotificationType.COURSE_APPROVED : NotificationType.POST_APPROVED;
            case REJECTED -> isCourse ? NotificationType.COURSE_REJECTED : NotificationType.POST_REJECTED;
            case PUBLISHED -> isCourse ? NotificationType.COURSE_PUBLISHED : NotificationType.POST_PUBLISHED;
            default -> isCourse ? NotificationType.COURSE_PENDING : NotificationType.POST_PENDING;
        };
    }

    public ResponseObject readNotification(UUID id) {
        var notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return null;
        }
        notification.setRead(true);
        return ResponseObject.builder().content(convertService.convertToNotificationDTO(notification)).status(HttpStatus.OK).build();
    }

    public ResponseObject getAllUnread(int page, int size) {
        var email = userService.getCurrentUser().getEmail();
        var result = userService.getUserByEmail(email);
        if(result.getContent() == null) return result;
        var noti = notificationRepository.findAllByRecipientEmailAndIsReadOrderByCreatedAtDesc(email, false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(noti).build();
    }

    public ResponseObject removeAllNotificationsByEmail() {
        var email = userService.getCurrentUser().getEmail();
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

    public ResponseObject readAllNotification() {
        var user = userService.getCurrentUser();

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

    public ResponseObject getAll(String type, int page, int size) {
        /*
        * type = unread, all
        * */

        QNotification notification = QNotification.notification;
        BooleanBuilder builder = new BooleanBuilder();
        var user = userService.getCurrentUser();

        builder.and(notification.recipient.email.eq(user.getEmail()));

        // get unread notification
        if(type.toUpperCase(Locale.ROOT).equals("UNREAD")) {
            builder.and(notification.isRead.eq(false));
        }

        List<Notification> notifications = jpaQueryFactory.selectFrom(notification).where(builder).orderBy(notification.createdAt.desc()).offset((long) page * size).limit(size).fetch();

        //get total current count
        long totalCount = Optional.ofNullable(jpaQueryFactory.select(notification.count()).from(notification).where(builder).fetchOne()).orElse(0L);

        //get total all element count
        long totalAllElements = Optional.ofNullable(jpaQueryFactory.select(notification.count()).from(notification).where(notification.recipient.email.eq(user.getEmail())).fetchOne()).orElse(0L);

        PageImpl<Notification> pageNotification = new PageImpl<>(notifications, PageRequest.of(page, size), totalCount);

        var totalUnReads = notificationRepository.countByIsReadAndRecipientEmail(false, user.getEmail());
        var result = convertService.convertToListNotificationDTO(pageNotification, totalAllElements, totalUnReads);

        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .content(result)
                .build();
    }

    public Notification saveNotification (Notification notification) {
        return notificationRepository.save(notification);
    }

    private void sendToUser(Notification notification, User recipient) {
        simpMessagingTemplate.convertAndSendToUser(recipient.getEmail(), "/notification", notification);
    }

    public void sendNotificationToUser(Notification notification) {
        var noti = saveNotification(notification);
        sendToUser(noti, notification.getRecipient());
    }

}
