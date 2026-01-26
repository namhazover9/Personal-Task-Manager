package com.example.taskmanager.repository;

import com.example.taskmanager.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    // Custom query to find last N messages if needed
    List<ChatMessage> findTop50ByOrderByTimestampDesc();
}
