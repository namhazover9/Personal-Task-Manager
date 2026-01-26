package com.example.taskmanager.service;

import com.example.taskmanager.dto.CategoryDto;
import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "categories", key = "#user.id")
    public List<CategoryDto> getAllCategories(User user) {
        log.info("Fetching categories from database for user: {}", user.getId());
        return categoryRepository.findByUser(user).stream()
                .map(MapperUtil::toCategoryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "categories", key = "#user.id")
    public CategoryDto createCategory(CategoryDto dto, User user) {
        log.info("Creating category and evicting cache for user: {}", user.getId());
        Category category = Category.builder()
                .name(dto.getName())
                .user(user)
                .build();

        Category saved = categoryRepository.save(category);
        return MapperUtil.toCategoryDto(saved);
    }

    @Transactional
    @CacheEvict(value = "categories", key = "#user.id")
    public CategoryDto updateCategory(Long id, CategoryDto dto, User user) {
        log.info("Updating category {} and evicting cache for user: {}", id, user.getId());
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Category not owned by user");
        }

        MapperUtil.toCategory(dto, category);

        Category updated = categoryRepository.save(category);
        return MapperUtil.toCategoryDto(updated);
    }

    @Transactional
    @CacheEvict(value = "categories", key = "#user.id")
    public void deleteCategory(Long id, User user) {
        log.info("Deleting category {} and evicting cache for user: {}", id, user.getId());
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Category not owned by user");
        }

        categoryRepository.delete(category);
    }
}