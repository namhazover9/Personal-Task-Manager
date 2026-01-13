package com.example.taskmanager.controller;

import com.example.taskmanager.dto.CategoryDto;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDto> getAllCategories(@AuthenticationPrincipal User user) {
        return categoryService.getAllCategories(user);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto dto, @AuthenticationPrincipal User user) {
        CategoryDto created = categoryService.createCategory(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public CategoryDto updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto dto, @AuthenticationPrincipal User user) {
        return categoryService.updateCategory(id, dto, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id, @AuthenticationPrincipal User user) {
        categoryService.deleteCategory(id, user);
        return ResponseEntity.noContent().build();
    }
}