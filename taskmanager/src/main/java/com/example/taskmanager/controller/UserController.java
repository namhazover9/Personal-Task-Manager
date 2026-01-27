package com.example.taskmanager.controller;

import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/search")
    public List<UserDto> searchUsers(@RequestParam String q) {
        return userRepository.searchUsers(q).stream()
                .map(u -> UserDto.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .alias(u.getAlias())
                        .email(u.getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String username;
        private String alias;
        private String email;
    }
}
