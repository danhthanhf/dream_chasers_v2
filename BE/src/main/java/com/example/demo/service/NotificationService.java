package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.entity.data.Notification;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private  NotificationRepository notificationRepository;
    private UserService userService;
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserService userService, SimpMessagingTemplate simpMessagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void sendNotificationToUser(CommentDTO commentDTO, String toUserEmail, String content) {
        if(toUserEmail == null) return;
        Notification notification = saveNotification(commentDTO, toUserEmail, content);
        var alias = toUserEmail.split("@")[0];
        simpMessagingTemplate.convertAndSendToUser(alias,"/notification", notification);
    }

    public Notification saveNotification(CommentDTO commentDTO,String toUserEmail, String content) {
        var sendToUser = userService.getUserByEmail(toUserEmail);
        if (sendToUser == null) {
            System.out.println("sendToUser not found");
            return null;
        }

        Notification notification;
        if(commentDTO == null) {
            notification = Notification.builder()
                    .date(LocalDateTime.now())
                    .fromUser("Admin Dream Chasers")
                    .user(sendToUser)
                    .content(content)
                    .build();
        }
        else {
            notification = Notification.builder()
                    .content(commentDTO.getContent())
                    .date(LocalDateTime.now())
                    .fromUser(commentDTO.getUserName())
                    .user(sendToUser)
                    .img(commentDTO.getAvatar())
                    .path(commentDTO.getPath())
                    .content(content)
                    .build();
        }
        sendToUser.getNotifications().add(notification);
        userService.save(sendToUser);
        return notification;
    }


    public Notification readNotification(int id) {
        var notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return null;
        }
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public Page<Notification> readAllNotification(int id) {
        var notifications = notificationRepository.findAllByUserIdOrderByDateDesc(id, PageRequest.of(0, 999999));

        if (notifications == null) {
            return null;
        }
        for (var notification : notifications ) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
        return notifications;
    }

    public void removeAllNotificationsByEmail(int id) {
        var notifications = notificationRepository.findAllByUserIdOrderByDateDesc(id, PageRequest.of(0, 999999));
        if (notifications == null) {
            return;
        }
            notificationRepository.deleteAll(notifications);
    }

    public Page<Notification> getAllNotificationsByEmail(int userId, int page, int size) {
        return notificationRepository.findAllByUserIdOrderByDateDesc(userId, PageRequest.of(page, size));
    }

}
