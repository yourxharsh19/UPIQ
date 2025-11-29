package com.SmartSpend.CategoryService.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    @NotEmpty(message = "Category type is required")
    private String type;

    private String description;
}

