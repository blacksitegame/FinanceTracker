package com.financetracker.repository;

import com.financetracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByUserId(Integer userId);

    @Query("SELECT c.categoryName, SUM(t.amount) " +
           "FROM Category c JOIN Transaction t ON c.categoryId = t.categoryId " +
           "WHERE c.userId = :userId " +
           "AND t.transactionDate >= :startDate " +
           "AND t.transactionDate <= :endDate " +
           "GROUP BY c.categoryName")
    List<Object[]> findCategoryBreakdown(@Param("userId") Integer userId,
                                       @Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);
}