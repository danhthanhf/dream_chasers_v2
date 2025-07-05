package com.danhthanhf.distantclass.controller.User;

import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping("/recent")
    public ResponseEntity<ResponseObject> getRecentChats(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var res = chatService.getRecentChats(page, size);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @GetMapping("/{email}")
    public ResponseEntity<ResponseObject> getChatByEmail(@PathVariable String email) {
        var res = chatService.getByEmail(email);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PutMapping("/{chatId}/read")
    public ResponseEntity<ResponseObject> readChat(@PathVariable UUID chatId) {
        var res = chatService.readChat(chatId);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PutMapping("/{chatId}/block")
    public ResponseEntity<ResponseObject> blockChat(@PathVariable UUID chatId) {
        var res = chatService.blockChat(chatId);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

}
