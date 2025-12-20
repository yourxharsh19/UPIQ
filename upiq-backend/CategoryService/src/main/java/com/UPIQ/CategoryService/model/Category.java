package com.UPIQ.CategoryService.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category type is required") // income or expense
    @Column(nullable = false)
    private String type;

    private String description;

    private String color;
    private String icon;

    // Later used for analytics (pie charts etc.)
    @Column(nullable = false)
    private Long userId;
}
