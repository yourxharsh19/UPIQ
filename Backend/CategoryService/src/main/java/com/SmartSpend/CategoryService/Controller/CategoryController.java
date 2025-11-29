package com.SmartSpend.CategoryService.Controller;

import com.SmartSpend.CategoryService.DTO.CategoryRequest;
import com.SmartSpend.CategoryService.DTO.CategoryResponse;
import com.SmartSpend.CategoryService.Service.CategoryService;
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
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request, userId));
    }

    // GET ALL CATEGORIES FOR USER
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(categoryService.getAllCategories(userId));
    }

    // GET CATEGORIES BY TYPE (income or expense)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByType(
            @PathVariable String type,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(categoryService.getCategoriesByType(userId, type));
    }

    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(categoryService.getCategoryById(id, userId));
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request, userId));
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId
    ) {
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.ok("Category deleted successfully");
    }

    // HEALTH CHECK ENDPOINT
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Category Service is running");
    }
}
