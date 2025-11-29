package com.SmartSpend.Transaction_Service.Transaction_Service.Service;

import com.SmartSpend.Transaction_Service.Transaction_Service.Model.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction addTransaction(Transaction transaction);

    List<Transaction> getUserTransactions(Long userId);

    List<Transaction> getUserTransactionsByCategory(Long userId, String category);

    void deleteTransaction(Long id);

    Transaction getById(Long id);
}
