package com.example.taskmanager.controller;

import com.example.taskmanager.entity.ChatMessage;
import com.example.taskmanager.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;

    @GetMapping("/history")
    public List<ChatMessage> getChatHistory() {
        // Return simple list for now
        return chatRepository.findAll();
    }
}
