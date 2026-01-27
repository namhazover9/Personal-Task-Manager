package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ChatMessageDto;
import com.example.taskmanager.dto.SendMessageDto;
import com.example.taskmanager.entity.ChatMessage;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;
    private final UserRepository userRepository;

    @MessageMapping("/chat.sendMessage")
    @Transactional
    public void sendMessage(@Payload SendMessageDto messageRequest, Principal principal) {
        try {
            String username = principal.getName();
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            ChatMessage saved = chatService.saveMessage(
                    messageRequest.getConversationId(), 
                    messageRequest.getContent(), 
                    sender
            );

            ChatMessageDto responseDto = ChatMessageDto.builder()
                    .id(saved.getId())
                    .content(saved.getContent())
                    .senderId(sender.getId())
                    .senderName(sender.getUsername())
                    .conversationId(saved.getConversation().getId())
                    .timestamp(saved.getTimestamp())
                    .build();

            // Broadcast to all participants
            // Broadcast to all participants
            saved.getConversation().getParticipants().forEach(p -> {
                String targetUsername = p.getUser().getUsername();
                log.info("Processing message for participant: {}", targetUsername);
                
                // SimpMessagingTemplate automatically prepends "/user/{username}" 
                // to the destination "/queue/messages"
                try {
                    simpMessagingTemplate.convertAndSendToUser(
                            targetUsername, 
                            "/queue/messages", 
                            responseDto
                    );
                    log.info("Sent WS message to user: {}", targetUsername);
                } catch (Exception ex) {
                    log.error("Failed to send WS message to user: {}", targetUsername, ex);
                }
            });
            
        } catch (Exception e) {
            log.error("Error sending message", e);
        }
    }
}
