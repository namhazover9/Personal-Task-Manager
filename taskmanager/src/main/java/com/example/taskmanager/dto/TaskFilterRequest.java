package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import lombok.Data;

@Data
public class TaskFilterRequest {
    private TaskStatus status;
    private Long categoryId;
    private String keyword;
    private int page = 0;
    private int size = 10;
    private String sortBy = "createdAt";     // mặc định sort theo ngày tạo
    private String sortDir = "desc";         // mới nhất trước
}