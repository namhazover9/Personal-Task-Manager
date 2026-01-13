package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Tìm tasks của user với filter
    @Query("SELECT t FROM Task t WHERE t.user = :user " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
            "AND (:keyword IS NULL OR " +
            "    LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) OR " +
            "    LOWER(t.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))" +
            ")")
    Page<Task> findByUserWithFilters(
            @Param("user") User user,
            @Param("status") TaskStatus status,
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            Pageable pageable);
}