package com.UPIQ.TransactionService.service;

import com.UPIQ.TransactionService.dto.TransactionResponse;

import java.util.List;

public interface TransactionService {

    TransactionResponse addTransaction(com.UPIQ.TransactionService.dto.CreateTransactionRequest request, Long userId);

    List<TransactionResponse> getUserTransactions(Long userId);

    List<TransactionResponse> getUserTransactionsByCategory(Long userId, String category);

    void deleteTransaction(Long id, Long userId);

    TransactionResponse getById(Long id, Long userId);

    TransactionResponse updateTransaction(Long id, com.UPIQ.TransactionService.dto.CreateTransactionRequest request,
            Long userId);

    void deleteAllTransactions(Long userId);
}
