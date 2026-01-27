package com.example.taskmanager.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ConversationDto {
    private Long id;
    private String name; // Computed name (e.g. Other User's name)
    private String type;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Long otherUserId; // For private chat
}
