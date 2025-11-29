package com.SmartSpend.CategoryService.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String type;
    private String description;
}
