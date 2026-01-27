package com.example.taskmanager.dto;

import lombok.Data;

@Data
public class SendMessageDto {
    private Long conversationId;
    private String content;
}
