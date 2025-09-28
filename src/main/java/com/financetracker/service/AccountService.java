package com.financetracker.service;

import com.financetracker.entity.Account;
import java.util.List;

public interface AccountService {
    List<Account> getAccountsByUserId(Integer userId);
    Account getAccountById(Integer id);
    Account createAccount(Account account);
    Account updateAccount(Account account);
    boolean deleteAccount(Integer id);
}