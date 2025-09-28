package com.financetracker.service.impl;

import com.financetracker.entity.Account;
import com.financetracker.repository.AccountRepository;
import com.financetracker.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public List<Account> getAccountsByUserId(Integer userId) {
        return accountRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    public Account getAccountById(Integer id) {
        return accountRepository.findById(id).orElse(null);
    }

    @Override
    public Account createAccount(Account account) {
        if (account.getIsActive() == null) {
            account.setIsActive(true);
        }
        return accountRepository.save(account);
    }

    @Override
    public Account updateAccount(Account account) {
        if (accountRepository.existsById(account.getAccountId())) {
            return accountRepository.save(account);
        }
        return null;
    }

    @Override
    public boolean deleteAccount(Integer id) {
        if (accountRepository.existsById(id)) {
            Account account = accountRepository.findById(id).orElse(null);
            if (account != null) {
                account.setIsActive(false);
                accountRepository.save(account);
                return true;
            }
        }
        return false;
    }
}