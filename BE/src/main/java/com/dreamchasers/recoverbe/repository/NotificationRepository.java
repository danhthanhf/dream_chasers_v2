package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.Notification;
import org.assertj.core.api.filter.NotFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findAllByUserEmail(String email, org.springframework.data.domain.Pageable pageable);
    Page<Notification> findAllByUserIdOrderByCreatedAtDesc(UUID id, org.springframework.data.domain.Pageable pageable);
    Page<Notification> findAllByUserEmailAndIsReadOrderByCreatedAtDesc(String email, boolean isRead, Pageable pageable);
    int countByIsReadAndUserEmail(boolean read, String email);

}
