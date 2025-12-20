package com.UPIQ.CategoryService.service.impl;

import com.UPIQ.CategoryService.dto.CategoryResponse;
import com.UPIQ.CategoryService.dto.CreateCategoryRequest;
import com.UPIQ.CategoryService.exceptions.CategoryNotFoundException;
import com.UPIQ.CategoryService.model.Category;
import com.UPIQ.CategoryService.repository.CategoryRepository;
import com.UPIQ.CategoryService.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request, Long userId) {
        // Validate category type
        if (request.getType() == null
                || (!request.getType().equalsIgnoreCase("income") && !request.getType().equalsIgnoreCase("expense"))) {
            throw new IllegalArgumentException("Category type must be 'income' or 'expense'");
        }

        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType().toLowerCase())
                .description(request.getDescription())
                .color(request.getColor())
                .icon(request.getIcon())
                .userId(userId)
                .build();
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories(Long userId) {
        List<Category> categories = categoryRepository.findByUserId(userId);
        return categories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getCategoriesByType(Long userId, String type) {
        if (type == null || (!type.equalsIgnoreCase("income") && !type.equalsIgnoreCase("expense"))) {
            throw new IllegalArgumentException("Category type must be 'income' or 'expense'");
        }
        List<Category> categories = categoryRepository.findByUserIdAndTypeIgnoreCase(userId, type.toLowerCase());
        return categories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id, Long userId) {
        // Fetch category or throw exception if not found
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CreateCategoryRequest request, Long userId) {
        // Validate category type
        if (request.getType() != null
                && (!request.getType().equalsIgnoreCase("income") && !request.getType().equalsIgnoreCase("expense"))) {
            throw new IllegalArgumentException("Category type must be 'income' or 'expense'");
        }

        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());
        if (request.getType() != null) {
            category.setType(request.getType().toLowerCase());
        }
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> {
                    if (categoryRepository.existsById(id)) {
                        return new CategoryNotFoundException(
                                "Category with id " + id + " exists but does not belong to user " + userId);
                    } else {
                        return new CategoryNotFoundException("Category not found with id: " + id);
                    }
                });

        categoryRepository.delete(category);
    }

    // Helper to convert Entity -> DTO
    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .description(category.getDescription())
                .color(category.getColor())
                .icon(category.getIcon())
                .build();
    }
}
