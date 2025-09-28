package com.financetracker.service;

import com.financetracker.entity.Category;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CategoryService {
    List<Category> getCategoriesByUserId(Integer userId);
    Category getCategoryById(Integer id);
    Category createCategory(Category category);
    Category updateCategory(Category category);
    boolean deleteCategory(Integer id);
    Map<String, BigDecimal> getCategoryBreakdown(Integer userId, LocalDate startDate, LocalDate endDate);
}