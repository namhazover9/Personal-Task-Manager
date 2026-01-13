package com.example.taskmanager.dto;

import lombok.Data;

// Trả về JWT
@Data
public class AuthResponseDto {
    private String token;

    public AuthResponseDto(String token) {
        this.token = token;
    }
}