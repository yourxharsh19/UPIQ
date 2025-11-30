package com.UPIQ.CategoryService.controller;

import com.UPIQ.CategoryService.dto.ApiResponse;
import com.UPIQ.CategoryService.dto.CategoryResponse;
import com.UPIQ.CategoryService.dto.CreateCategoryRequest;
import com.UPIQ.CategoryService.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // CREATE CATEGORY
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        CategoryResponse category = categoryService.createCategory(request, userId);
        ApiResponse<CategoryResponse> response = ApiResponse.<CategoryResponse>builder()
                .success(true)
                .data(category)
                .message("Category created successfully")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET ALL CATEGORIES FOR USER
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(
            @RequestHeader("X-User-Id") Long userId
    ) {
        List<CategoryResponse> categories = categoryService.getAllCategories(userId);
        ApiResponse<List<CategoryResponse>> response = ApiResponse.<List<CategoryResponse>>builder()
                .success(true)
                .data(categories)
                .message("Categories retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // GET CATEGORIES BY TYPE (income or expense)
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategoriesByType(
            @PathVariable String type,
            @RequestHeader("X-User-Id") Long userId
    ) {
        List<CategoryResponse> categories = categoryService.getCategoriesByType(userId, type);
        ApiResponse<List<CategoryResponse>> response = ApiResponse.<List<CategoryResponse>>builder()
                .success(true)
                .data(categories)
                .message("Categories retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId
    ) {
        CategoryResponse category = categoryService.getCategoryById(id, userId);
        ApiResponse<CategoryResponse> response = ApiResponse.<CategoryResponse>builder()
                .success(true)
                .data(category)
                .message("Category retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        CategoryResponse category = categoryService.updateCategory(id, request, userId);
        ApiResponse<CategoryResponse> response = ApiResponse.<CategoryResponse>builder()
                .success(true)
                .data(category)
                .message("Category updated successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId
    ) {
        System.out.println("DELETE request received for category id: " + id + ", userId: " + userId);
        categoryService.deleteCategory(id, userId);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .data(null)
                .message("Category deleted successfully")
                .build();
        System.out.println("Returning response: " + response);
        return ResponseEntity.ok(response);
    }

    // HEALTH CHECK ENDPOINT
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .data("UPIQ-Category-Service is running")
                .message("Service is healthy")
                .build();
        return ResponseEntity.ok(response);
    }
}

