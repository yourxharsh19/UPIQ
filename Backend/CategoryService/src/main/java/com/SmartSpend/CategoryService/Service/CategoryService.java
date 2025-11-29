package com.SmartSpend.CategoryService.Service;

import com.SmartSpend.CategoryService.DTO.CategoryRequest;
import com.SmartSpend.CategoryService.DTO.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request, Long userId);

    CategoryResponse getCategoryById(Long id, Long userId);

    List<CategoryResponse> getAllCategories(Long userId);

    List<CategoryResponse> getCategoriesByType(Long userId, String type);

    CategoryResponse updateCategory(Long id, CategoryRequest request, Long userId);

    void deleteCategory(Long id, Long userId);
}
