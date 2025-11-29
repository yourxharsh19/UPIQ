package com.SmartSpend.CategoryService.Service.Impl;

import com.SmartSpend.CategoryService.DTO.CategoryRequest;
import com.SmartSpend.CategoryService.DTO.CategoryResponse;
import com.SmartSpend.CategoryService.Exception.CategoryNotFoundException;
import com.SmartSpend.CategoryService.Model.Category;
import com.SmartSpend.CategoryService.Repository.CategoryRepository;
import com.SmartSpend.CategoryService.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request, Long userId) {
        // Validate category type
        if (request.getType() == null || (!request.getType().equalsIgnoreCase("income") && !request.getType().equalsIgnoreCase("expense"))) {
            throw new IllegalArgumentException("Category type must be 'income' or 'expense'");
        }
        
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType().toLowerCase())
                .description(request.getDescription())
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
    public CategoryResponse updateCategory(Long id, CategoryRequest request, Long userId) {
        // Validate category type
        if (request.getType() != null && (!request.getType().equalsIgnoreCase("income") && !request.getType().equalsIgnoreCase("expense"))) {
            throw new IllegalArgumentException("Category type must be 'income' or 'expense'");
        }
        
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getType() != null) {
            category.setType(request.getType().toLowerCase());
        }
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Override
    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    // Helper to convert Entity -> DTO
    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .description(category.getDescription())
                .build();
    }
}
