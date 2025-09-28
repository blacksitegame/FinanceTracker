package com.financetracker.service.impl;

import com.financetracker.entity.Category;
import com.financetracker.repository.CategoryRepository;
import com.financetracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getCategoriesByUserId(Integer userId) {
        return categoryRepository.findByUserId(userId);
    }

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Category category) {
        if (categoryRepository.existsById(category.getCategoryId())) {
            return categoryRepository.save(category);
        }
        return null;
    }

    @Override
    public boolean deleteCategory(Integer id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Map<String, BigDecimal> getCategoryBreakdown(Integer userId, LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = categoryRepository.findCategoryBreakdown(userId, startDate, endDate);
        Map<String, BigDecimal> breakdown = new HashMap<>();

        for (Object[] result : results) {
            String categoryName = (String) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            breakdown.put(categoryName, amount);
        }

        return breakdown;
    }
}