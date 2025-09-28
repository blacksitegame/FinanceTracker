package com.financetracker.repository;

import com.financetracker.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    List<Account> findByUserIdAndIsActiveTrue(Integer userId);

    List<Account> findByUserId(Integer userId);
}