package com.SmartSpend.CategoryService.Repository;

import com.SmartSpend.CategoryService.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserId(Long userId);

    List<Category> findByUserIdAndTypeIgnoreCase(Long userId, String type);

    Optional<Category> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);
}
