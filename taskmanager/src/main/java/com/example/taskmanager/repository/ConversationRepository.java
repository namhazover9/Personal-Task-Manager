package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c JOIN c.participants cp WHERE cp.user.id = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUserId(Long userId);

    @Query("SELECT c FROM Conversation c " +
           "JOIN c.participants cp1 " +
           "JOIN c.participants cp2 " +
           "WHERE c.type = 'PRIVATE' " +
           "AND cp1.user.id = :userId1 " +
           "AND cp2.user.id = :userId2")
    Optional<Conversation> findPrivateConversation(Long userId1, Long userId2);
}
