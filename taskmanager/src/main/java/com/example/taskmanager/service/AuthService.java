package com.example.taskmanager.service;

import com.example.taskmanager.dto.AuthRequestDto;
import com.example.taskmanager.dto.AuthResponseDto;
import com.example.taskmanager.dto.UserRegistrationDto;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.BadRequestException;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(UserRegistrationDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .build();

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(AuthRequestDto dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails.                               getUsername());

        return new AuthResponseDto(token);
    }
}