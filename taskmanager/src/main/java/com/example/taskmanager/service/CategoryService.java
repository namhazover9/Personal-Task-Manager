package com.example.taskmanager.service;

import com.example.taskmanager.dto.CategoryDto;
import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories(User user) {
        return categoryRepository.findByUser(user).stream()
                .map(MapperUtil::toCategoryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto, User user) {
        Category category = Category.builder()
                .name(dto.getName())
                .user(user)
                .build();

        Category saved = categoryRepository.save(category);
        return MapperUtil.toCategoryDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto, User user) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().equals(user)) {
            throw new ResourceNotFoundException("Category not owned by user");
        }

        MapperUtil.toCategory(dto, category);

        Category updated = categoryRepository.save(category);
        return MapperUtil.toCategoryDto(updated);
    }

    @Transactional
    public void deleteCategory(Long id, User user) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().equals(user)) {
            throw new ResourceNotFoundException("Category not owned by user");
        }

        categoryRepository.delete(category);
    }
}