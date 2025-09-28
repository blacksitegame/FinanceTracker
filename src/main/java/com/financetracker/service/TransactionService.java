package com.financetracker.service;

import com.financetracker.entity.Transaction;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TransactionService {
    List<Transaction> getTransactions(Integer userId, LocalDate startDate, LocalDate endDate);
    Transaction getTransactionById(Integer id);
    Transaction createTransaction(Transaction transaction);
    Transaction updateTransaction(Transaction transaction);
    boolean deleteTransaction(Integer id);
    List<Transaction> getRecentTransactions(Integer userId, int limit);
    Map<String, Object> generateMonthlyReport(Integer userId, int year, int month);
}