package com.SmartSpend.Transaction_Service.Transaction_Service.Service.impl;

import com.SmartSpend.Transaction_Service.Transaction_Service.Model.Transaction;
import com.SmartSpend.Transaction_Service.Transaction_Service.Repository.TransactionRepository;
import com.SmartSpend.Transaction_Service.Transaction_Service.Service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository repository;

    @Override
    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDateTime.now());
        }
        return repository.save(transaction);
    }

    @Override
    public List<Transaction> getUserTransactions(Long userId) {
        return repository.findByUserIdOrderByDateDesc(userId);
    }

    @Override
    public List<Transaction> getUserTransactionsByCategory(Long userId, String category) {
        return repository.findByUserIdAndCategoryIgnoreCase(userId, category);
    }

    @Override
    public void deleteTransaction(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Transaction not found");
        }
        repository.deleteById(id);
    }

    @Override
    public Transaction getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }
}
