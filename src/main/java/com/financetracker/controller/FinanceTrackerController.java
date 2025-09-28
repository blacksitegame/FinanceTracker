package com.financetracker.controller;

import com.financetracker.entity.Transaction;
import com.financetracker.entity.Account;
import com.financetracker.entity.Category;
import com.financetracker.dto.DashboardSummary;
import com.financetracker.service.TransactionService;
import com.financetracker.service.AccountService;
import com.financetracker.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "file://"}, allowCredentials = "true")
public class FinanceTrackerController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @RequestParam Integer userId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<Transaction> transactions = transactionService.getTransactions(userId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Integer id) {
        Transaction transaction = transactionService.getTransactionById(id);
        if (transaction != null) {
            return ResponseEntity.ok(transaction);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Integer id,
            @RequestBody Transaction transaction) {
        transaction.setTransactionId(id);
        Transaction updated = transactionService.updateTransaction(transaction);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Integer id) {
        boolean deleted = transactionService.deleteTransaction(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts(@RequestParam Integer userId) {
        List<Account> accounts = accountService.getAccountsByUserId(userId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Integer id) {
        Account account = accountService.getAccountById(id);
        if (account != null) {
            return ResponseEntity.ok(account);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/accounts")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account created = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<Account> updateAccount(
            @PathVariable Integer id,
            @RequestBody Account account) {
        account.setAccountId(id);
        Account updated = accountService.updateAccount(account);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories(@RequestParam Integer userId) {
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category created = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category) {
        category.setCategoryId(id);
        Category updated = categoryService.updateCategory(category);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        boolean deleted = categoryService.deleteCategory(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummary> getDashboard(@RequestParam Integer userId) {
        DashboardSummary summary = new DashboardSummary();

        List<Account> accounts = accountService.getAccountsByUserId(userId);
        BigDecimal totalBalance = accounts.stream()
            .map(Account::getCurrentBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalBalance(totalBalance);

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        List<Transaction> monthTransactions = transactionService.getTransactions(
            userId, startOfMonth, endOfMonth);

        BigDecimal monthlyIncome = monthTransactions.stream()
            .filter(t -> "income".equals(t.getTransactionType()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setMonthlyIncome(monthlyIncome);

        BigDecimal monthlyExpenses = monthTransactions.stream()
            .filter(t -> "expense".equals(t.getTransactionType()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setMonthlyExpenses(monthlyExpenses);

        List<Transaction> recentTransactions = transactionService.getRecentTransactions(userId, 10);
        summary.setRecentTransactions(recentTransactions);

        Map<String, BigDecimal> categoryBreakdown = categoryService.getCategoryBreakdown(
            userId, startOfMonth, endOfMonth);
        summary.setCategoryBreakdown(categoryBreakdown);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/reports/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyReport(
            @RequestParam Integer userId,
            @RequestParam int year,
            @RequestParam int month) {
        Map<String, Object> report = transactionService.generateMonthlyReport(userId, year, month);
        return ResponseEntity.ok(report);
    }
}