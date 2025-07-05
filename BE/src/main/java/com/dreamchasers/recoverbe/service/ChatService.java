package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.ChatDTO;
import com.dreamchasers.recoverbe.dto.MessageDTO;
import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.entity.chat.Chat;
import com.dreamchasers.recoverbe.entity.chat.Message;
import com.dreamchasers.recoverbe.entity.chat.QChat;
import com.dreamchasers.recoverbe.entity.chat.UserChat;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.helper.converters.ConvertService;
import com.dreamchasers.recoverbe.repository.ChatRepository;
import com.dreamchasers.recoverbe.repository.MessageRepository;
import com.dreamchasers.recoverbe.repository.UserChatRepository;
import com.dreamchasers.recoverbe.repository.UserRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserChatRepository userChatRepository;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ConvertService convertService;
    private final JPAQueryFactory queryFactory;

    public ResponseObject blockChat(UUID chatId) {
        var chat = chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
        var currentUser = userService.getCurrentUser();
        chat.getParticipants().forEach(userChat -> {
            if(Objects.equals(userChat.getUser().getEmail(), currentUser.getEmail())) {
                userChat.setBlocked(true);
                userChatRepository.save(userChat);
            }
        });

        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject readChat(UUID chatId) {
        var chat = chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        List<UserChat> userChatsToUpdate = new ArrayList<>();
        for (UserChat userChat : chat.getParticipants()) {
            if (userChat.getUser().equals(userService.getCurrentUser())) {
                userChat.setRead(true);
                userChatsToUpdate.add(userChat);
            }
        }
        userChatRepository.saveAll(userChatsToUpdate);

        return ResponseObject.builder().status(HttpStatus.OK).content(convertService.convertToChatDTO(chat, userService.getCurrentUser())).build();
    }

    private UserChat createUserChat(User user) {
        return new UserChat(user, false);
    }

    private void updateStatusChatForParticipant(Chat chat, User sender) {
        List<UserChat> userChatsToUnRead = new ArrayList<>();
        List<UserChat> userChatsToRead = new ArrayList<>();
        for (UserChat userChat : chat.getParticipants()) {
            if (!userChat.getUser().getId().equals(sender.getId())) {
                userChatsToUnRead.add(userChat);
            } else {
                userChatsToRead.add(userChat);
            }
        }
        for (UserChat userChat : userChatsToUnRead) {
            userChat.setRead(false);
            userChatRepository.save(userChat);
        }

        for (UserChat userChat : userChatsToRead) {
            userChat.setRead(true);
            userChatRepository.save(userChat);
        }
    }

    private Chat createChat(User user1, User user2) {
        var userChat1 = createUserChat(user1);
        var userChat2 = createUserChat(user2);
        userChatRepository.save(userChat1);
        userChatRepository.save(userChat2);

        var chat = Chat.builder().participants(List.of(userChat1, userChat2)).build();
        userChat1.setChat(chat);
        userChat2.setChat(chat);
        return chat;
    }

    public MessageDTO saveMessage(String email, MessageDTO message) {
        var userEmail = message.getSender().getEmail();
        var sender = userRepository.findByEmail(userEmail).orElseThrow(() -> new EntityNotFoundException("User not found"));

        var recipient = userService.findByEmail(email);

        Chat chat = null;

        if(message.getChatId() != null) {
            chat = chatRepository.findById(message.getChatId()).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
        }
        else {
            chat = createChat(sender, recipient);
        }


        chat.setLastMessageTime(LocalDateTime.now());
        // set recipient as unread
        updateStatusChatForParticipant(chat, sender);

        Message newMessage = createMessage(message.getContent(), sender, chat);

        chat = chatRepository.save(chat);

        messageRepository.save(newMessage);

        message.setSender(convertService.convertToUserBasicDTO(sender));
        message.setCreatedAt(LocalDateTime.now());
        message.setChatId(chat.getId());
        return message;
    }

    public ResponseObject getRecentChats(int page, int size) {
        User currentUser = userService.getCurrentUser();
        QChat chat = QChat.chat;

        var res = queryFactory.selectFrom(chat)
                .leftJoin(chat.participants)
                .where(chat.participants.any().user.email.eq(currentUser.getEmail()))
                .orderBy(chat.lastMessageTime.desc())
                .offset((long) page * size)
                .limit(size)
                .fetch();

        List<ChatDTO> result = res.stream().map(c -> convertService.convertToChatDTO(c, currentUser)).toList();

        return ResponseObject.builder().content(result).status(HttpStatus.OK).build();
    }

    public Message createMessage(String message, User sender, Chat chat) {
        return Message.builder().content(message).sender(sender).chat(chat).build();
    }

    public void sendNotificationForNewMessage(User user, String content) {
        simpMessagingTemplate.convertAndSendToUser(user.getEmail(), "/chats/notification", content);
    }

    public Page<MessageDTO> getMessageInChat(UUID chatId, int page, int size) {
        var pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        var temp = messageRepository.findByChatId(chatId, pageRequest);

        // Create a modifiable list
        List<MessageDTO> messageDTOs = new ArrayList<>(temp.map(convertService::convertToMessageDTO).getContent());
        Collections.reverse(messageDTOs);

        return new PageImpl<>(messageDTOs, pageRequest, temp.getTotalElements());
    }

    public ResponseObject getByEmail(String email) {
        User user1 = userService.getCurrentUser();
        User user2 = userService.findByEmail(email);

        var chat = queryFactory.selectFrom(QChat.chat).where(
                QChat.chat.participants.any().user.email.eq(user1.getEmail())
                        .and(QChat.chat.participants.any().user.email.eq(user2.getEmail()))
        ).fetchFirst();

        ChatDTO chatDTO = null;
        if(chat != null) {
            Page messages = getMessageInChat(chat.getId(), 0, 10);
            chatDTO = ChatDTO.builder().messages(messages).id(chat.getId()).build();
        }
        return ResponseObject.builder().content(chatDTO).status(HttpStatus.OK).build();
    }

}
