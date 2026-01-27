package com.example.taskmanager.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageDto {
    private Long id;
    private String content;
    private Long senderId;
    private String senderName;
    private Long conversationId;
    private LocalDateTime timestamp;
}
