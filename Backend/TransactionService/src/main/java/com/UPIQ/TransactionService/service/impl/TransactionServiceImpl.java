package com.UPIQ.TransactionService.service.impl;

import com.UPIQ.TransactionService.dto.CreateTransactionRequest;
import com.UPIQ.TransactionService.dto.TransactionResponse;
import com.UPIQ.TransactionService.exceptions.TransactionNotFoundException;
import com.UPIQ.TransactionService.model.Transaction;
import com.UPIQ.TransactionService.repository.TransactionRepository;
import com.UPIQ.TransactionService.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository repository;

    @Override
    public TransactionResponse addTransaction(CreateTransactionRequest request, Long userId) {
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .type(request.getType())
                .paymentMethod(request.getPaymentMethod())
                .userId(userId)
                .date(LocalDateTime.now())
                .build();
        transaction = repository.save(transaction);
        return mapToResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getUserTransactions(Long userId) {
        List<Transaction> transactions = repository.findByUserIdOrderByDateDesc(userId);
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getUserTransactionsByCategory(Long userId, String category) {
        List<Transaction> transactions = repository.findByUserIdAndCategoryIgnoreCase(userId, category);
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTransaction(Long id) {
        if (!repository.existsById(id)) {
            throw new TransactionNotFoundException("Transaction not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public TransactionResponse getById(Long id) {
        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .userId(transaction.getUserId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .category(transaction.getCategory())
                .description(transaction.getDescription())
                .date(transaction.getDate())
                .paymentMethod(transaction.getPaymentMethod())
                .build();
    }
}

