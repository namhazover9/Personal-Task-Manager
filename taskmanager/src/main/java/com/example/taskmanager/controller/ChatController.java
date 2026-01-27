package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ChatMessageDto;
import com.example.taskmanager.dto.ConversationDto;
import com.example.taskmanager.entity.ChatMessage;
import com.example.taskmanager.entity.Conversation;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    @GetMapping("/conversations")
    public List<ConversationDto> getUserConversations(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return chatService.getUserConversations(user).stream()
                .map(c -> {
                    // Logic to find name/otherUserId 
                    String name = "Group";
                    Long otherUserId = null;
                    if (c.getType() == Conversation.ConversationType.PRIVATE) {
                         User other = c.getParticipants().stream()
                                 .filter(p -> !p.getUser().getId().equals(user.getId()))
                                 .findFirst()
                                 .map(p -> p.getUser())
                                 .orElse(null);
                         if (other != null) {
                             name = other.getAlias() != null ? other.getAlias() : other.getUsername();
                             otherUserId = other.getId();
                         }
                    }
                    return ConversationDto.builder()
                            .id(c.getId())
                            .name(name)
                            .type(c.getType().name())
                            .lastMessageAt(c.getLastMessageAt())
                            .otherUserId(otherUserId)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/conversations/private")
    public ConversationDto createPrivateChat(@RequestParam Long userId, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Conversation c = chatService.createOrGetPrivateConversation(currentUser, userId);
        
        // Return simple DTO
        return ConversationDto.builder()
                .id(c.getId())
                .name("Private Chat")
                .type(c.getType().name())
                .otherUserId(userId)
                .build();
    }

    @GetMapping("/conversations/{id}/messages")
    public List<ChatMessageDto> getMessages(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatService.getConversationMessages(id, user).stream()
                .map(m -> ChatMessageDto.builder()
                        .id(m.getId())
                        .content(m.getContent())
                        .senderId(m.getSender().getId())
                        .senderName(m.getSender().getUsername())
                        .conversationId(m.getConversation().getId())
                        .timestamp(m.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
