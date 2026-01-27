package com.example.taskmanager.service;

import com.example.taskmanager.entity.ChatMessage;
import com.example.taskmanager.entity.Conversation;
import com.example.taskmanager.entity.ConversationParticipant;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.ChatRepository;
import com.example.taskmanager.repository.ConversationRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findByUserId(user.getId());
    }

    @Transactional
    public Conversation createOrGetPrivateConversation(User user1, Long user2Id) {
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<Conversation> existing = conversationRepository.findPrivateConversation(user1.getId(), user2Id);
        if (existing.isPresent()) {
            return existing.get();
        }

        Conversation conversation = Conversation.builder()
                .type(Conversation.ConversationType.PRIVATE)
                .lastMessageAt(LocalDateTime.now())
                .build();

        ConversationParticipant p1 = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user1)
                .build();
        
        ConversationParticipant p2 = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user2)
                .build();

        conversation.getParticipants().add(p1);
        conversation.getParticipants().add(p2);

        return conversationRepository.save(conversation);
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> getConversationMessages(Long conversationId, User user) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        // Verify user is participant
        boolean isParticipant = conversation.getParticipants().stream()
                .anyMatch(p -> p.getUser().getId().equals(user.getId()));
        
        if (!isParticipant) {
             throw new RuntimeException("Access denied");
        }

        return chatRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    @Transactional
    public ChatMessage saveMessage(Long conversationId, String content, User sender) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .build(); // Timestamp handled by @CreationTimestamp

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation); // Update last message time

        return chatRepository.save(message);
    }
}
