package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.dto.TaskFilterRequest;
import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<TaskDto> getTasksWithFilters(TaskFilterRequest filter, User user) {
        String sortBy = Optional.ofNullable(filter.getSortBy())
                .filter(s -> !s.isBlank())
                .orElse("updatedAt");

        Sort.Direction direction =
                "asc".equalsIgnoreCase(filter.getSortDir())
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(direction, sortBy)
        );

        // Xử lý keyword: nếu null hoặc rỗng → truyền null thật sự để query bỏ qua
        String keyword = Optional.ofNullable(filter.getKeyword())
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElse(null);

        Page<Task> taskPage = taskRepository.findByUserWithFilters(
                user,
                filter.getStatus(),
                filter.getCategoryId(),
                keyword,
                pageable
        );

        return taskPage.map(MapperUtil::toTaskDto);
    }

    @Transactional
    public TaskDto saveTask(Long id, TaskDto dto, User user) {
        Task task;

        if (id == null) {
            // Create new
            task = new Task();
            task.setUser(user); // bắt buộc thuộc user
        } else {
            // Update existing
            task = taskRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

            if (!task.getUser().getId().equals(user.getId())) {
                throw new ResourceNotFoundException("Task not owned by user");
            }
        }

        // Map common fields
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDeadline(dto.getDeadline());
        task.setStatus(dto.getStatus());
        task.setCompleted(dto.isCompleted());

        // Handle category
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

            if (category.getUser() == null || !category.getUser().getId().equals(user.getId())) {
                throw new ResourceNotFoundException("Category not owned by user");
            }

            task.setCategory(category);
        } else {
            task.setCategory(null); // cho phép bỏ category
        }

        Task saved = taskRepository.save(task);
        return MapperUtil.toTaskDto(saved);
    }

    @Transactional
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not owned by user");
        }

        taskRepository.delete(task);
    }
}