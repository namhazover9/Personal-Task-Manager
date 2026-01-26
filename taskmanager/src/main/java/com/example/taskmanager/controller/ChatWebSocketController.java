package com.example.taskmanager.controller;

import com.example.taskmanager.entity.ChatMessage;
import com.example.taskmanager.repository.ChatRepository;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRepository chatRepository;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "chat-topic";

    // 1. Client sends message to /app/chat.sendMessage
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage message) {
        try {
            message.setTimestamp(LocalDateTime.now());
            
            // Save to DB
            chatRepository.save(message);

            // Serialize and send to Kafka
            String jsonMessage = objectMapper.writeValueAsString(message);
            log.info("Sending message to Kafka topic {}: {}", TOPIC, jsonMessage);
            kafkaTemplate.send(TOPIC, jsonMessage);
            
        } catch (Exception e) {
            log.error("Error sending message", e);
        }
    }

    // 2. Listen to Kafka topic and broadcast to all WebSocket clients subscribed to /topic/public
    @KafkaListener(topics = TOPIC, groupId = "chat-group")
    public void listen(String message) {
        try {
            log.info("Received message from Kafka: {}", message);
            
            // Deserialize (optional if we just want to pass string, but good practice to validate)
            ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);

            // Broadcast to WebSocket clients
            simpMessagingTemplate.convertAndSend("/topic/public", chatMessage);
            
        } catch (Exception e) {
            log.error("Error processing Kafka message", e);
        }
    }
}
