package com.financetracker.service.impl;

import com.financetracker.entity.Transaction;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public List<Transaction> getTransactions(Integer userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    @Override
    public Transaction getTransactionById(Integer id) {
        return transactionRepository.findById(id).orElse(null);
    }

    @Override
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction updateTransaction(Transaction transaction) {
        if (transactionRepository.existsById(transaction.getTransactionId())) {
            return transactionRepository.save(transaction);
        }
        return null;
    }

    @Override
    public boolean deleteTransaction(Integer id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Transaction> getRecentTransactions(Integer userId, int limit) {
        List<Transaction> transactions = transactionRepository.findRecentTransactionsByUserId(userId);
        return transactions.stream().limit(limit).toList();
    }

    @Override
    public Map<String, Object> generateMonthlyReport(Integer userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Transaction> transactions = getTransactions(userId, startDate, endDate);

        BigDecimal totalIncome = transactions.stream()
            .filter(t -> "income".equals(t.getTransactionType()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
            .filter(t -> "expense".equals(t.getTransactionType()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("year", year);
        report.put("totalIncome", totalIncome);
        report.put("totalExpenses", totalExpenses);
        report.put("netIncome", totalIncome.subtract(totalExpenses));
        report.put("transactionCount", transactions.size());

        return report;
    }
}