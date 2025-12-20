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
        System.out.println("=== DELETE CATEGORY DEBUG ===");
        System.out.println(
                "Requested category id: " + id + " (type: " + (id != null ? id.getClass().getName() : "null") + ")");
        System.out.println("Requested userId: " + userId + " (type: "
                + (userId != null ? userId.getClass().getName() : "null") + ")");

        // First check if category exists at all
        boolean categoryExists = categoryRepository.existsById(id);
        System.out.println("Category with id " + id + " exists in DB: " + categoryExists);

        // Check if category exists but belongs to different user
        if (categoryExists) {
            categoryRepository.findById(id).ifPresent(cat -> {
                System.out.println("Category found in DB:");
                System.out.println("  - id: " + cat.getId() + " (type: " + cat.getId().getClass().getName() + ")");
                System.out.println("  - userId: " + cat.getUserId() + " (type: "
                        + (cat.getUserId() != null ? cat.getUserId().getClass().getName() : "null") + ")");
                System.out.println("  - name: " + cat.getName());

                // Compare userIds
                if (cat.getUserId() != null && userId != null) {
                    boolean equals = cat.getUserId().equals(userId);
                    boolean longEquals = cat.getUserId().longValue() == userId.longValue();
                    System.out.println("  - userId comparison: " + cat.getUserId() + " == " + userId + " ? " + equals);
                    System.out.println("  - userId longValue comparison: " + cat.getUserId().longValue() + " == "
                            + userId.longValue() + " ? " + longEquals);

                    if (!equals) {
                        System.out.println("  *** MISMATCH: Category belongs to userId " + cat.getUserId()
                                + " but you're requesting as userId " + userId + " ***");
                        System.out.println("  *** SOLUTION: Use the JWT token for userId " + cat.getUserId()
                                + " to delete this category ***");
                    }
                } else {
                    System.out.println("  - ERROR: One of the userIds is null!");
                }
            });
        }

        // Try to find the category
        Optional<Category> categoryOpt = categoryRepository.findByIdAndUserId(id, userId);
        System.out.println("findByIdAndUserId result: " + (categoryOpt.isPresent() ? "FOUND" : "NOT FOUND"));

        if (!categoryOpt.isPresent()) {
            // Try alternative query to see what's in the database
            System.out.println("Trying alternative: findAll categories for userId " + userId);
            List<Category> userCategories = categoryRepository.findByUserId(userId);
            System.out.println("Categories for userId " + userId + ": " + userCategories.size());
            userCategories.forEach(cat -> System.out.println("  - id: " + cat.getId() + ", name: " + cat.getName()));
        }

        Category category = categoryOpt
                .orElseThrow(() -> {
                    // Provide more helpful error message
                    if (categoryExists) {
                        return new CategoryNotFoundException(
                                "Category with id " + id + " exists but does not belong to user " + userId);
                    } else {
                        return new CategoryNotFoundException("Category not found with id: " + id);
                    }
                });

        // Log before deletion for debugging
        System.out.println("Deleting category with id: " + id + " for userId: " + userId);
        System.out.println("Category found: " + category.getName());

        categoryRepository.delete(category);
        // Flush to ensure deletion is committed immediately
        categoryRepository.flush();

        // Verify deletion
        boolean exists = categoryRepository.existsById(id);
        System.out.println("Category deleted. Still exists: " + exists);
        System.out.println("=== END DELETE DEBUG ===");
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
