package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.User.Notification;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findAllByRecipientEmail(String email, org.springframework.data.domain.Pageable pageable);
    Page<Notification> findAllByRecipientIdOrderByCreatedAtDesc(UUID id, org.springframework.data.domain.Pageable pageable);
    Page<Notification> findAllByRecipientEmailAndIsReadOrderByCreatedAtDesc(String email, boolean isRead, Pageable pageable);
    int countByIsReadAndRecipientEmail(boolean read, String email);
    boolean existsBySenderAndType(User sender, NotificationType type);
}
