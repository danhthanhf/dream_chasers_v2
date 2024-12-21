package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.entity.chat.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    @Query("SELECT c FROM Chat c JOIN c.participants p1 JOIN c.participants p2 " +
            "WHERE p1 = :user1 AND p2 = :user2")
    Chat findByParticipants(User user1, User user2);

    Optional<Chat> findById(UUID chatId);

}
