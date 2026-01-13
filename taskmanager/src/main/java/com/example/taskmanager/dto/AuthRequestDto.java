package com.example.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Cho đăng nhập
@Data
public class AuthRequestDto {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}