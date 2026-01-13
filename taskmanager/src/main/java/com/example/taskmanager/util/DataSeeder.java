package com.example.taskmanager.util;

import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seed() {
        if (userRepository.count() == 0) {
            // Tạo user mẫu
            User demoUser = User.builder()
                    .username("demo")
                    .password(passwordEncoder.encode("demo123"))
                    .email("demo@example.com")
                    .build();
            userRepository.save(demoUser);

            // Tạo categories
            Category work = Category.builder().name("Công việc").user(demoUser).build();
            Category personal = Category.builder().name("Cá nhân").user(demoUser).build();
            categoryRepository.save(work);
            categoryRepository.save(personal);

            // Tạo tasks mẫu
            taskRepository.save(Task.builder()
                    .title("Học Spring Boot")
                    .description("Hoàn thiện project task manager")
                    .deadline(LocalDateTime.now().plusDays(3))
                    .status(TaskStatus.IN_PROGRESS)
                    .user(demoUser)
                    .category(work)
                    .build());

            taskRepository.save(Task.builder()
                    .title("Đi chợ")
                    .description("Mua rau củ cuối tuần")
                    .deadline(LocalDateTime.now().plusDays(1))
                    .status(TaskStatus.PENDING)
                    .user(demoUser)
                    .category(personal)
                    .build());

            taskRepository.save(Task.builder()
                    .title("Hoàn thành báo cáo")
                    .status(TaskStatus.COMPLETED)
                    .completed(true)
                    .user(demoUser)
                    .category(work)
                    .build());
        }
    }
}