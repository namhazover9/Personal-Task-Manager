package com.example.taskmanager.util;

import com.example.taskmanager.dto.CategoryDto;
import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.Task;

public class MapperUtil {

    public static TaskDto toTaskDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDeadline(task.getDeadline());
        dto.setStatus(task.getStatus());
        dto.setCompleted(task.isCompleted());
        if (task.getCategory() != null) {
            dto.setCategoryId(task.getCategory().getId());
        }
        return dto;
    }

    public static Task toTask(TaskDto dto, Task task) {
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDeadline(dto.getDeadline());
        task.setStatus(dto.getStatus());
        task.setCompleted(dto.isCompleted());
        return task;
    }

    public static CategoryDto toCategoryDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }

    public static Category toCategory(CategoryDto dto, Category category) {
        category.setName(dto.getName());
        return category;
    }
}