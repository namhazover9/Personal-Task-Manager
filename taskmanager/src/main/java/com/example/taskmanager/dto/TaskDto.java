package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private LocalDateTime deadline;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    private boolean completed;

    private Long categoryId;

}