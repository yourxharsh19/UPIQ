package com.UPIQ.TransactionService.controller;

import com.UPIQ.TransactionService.dto.ApiResponse;
import com.UPIQ.TransactionService.dto.CreateTransactionRequest;
import com.UPIQ.TransactionService.dto.TransactionResponse;
import com.UPIQ.TransactionService.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    // ------------------- ADD TRANSACTION -------------------
    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> add(
            @Valid @RequestBody CreateTransactionRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) {
        TransactionResponse transaction = service.addTransaction(request, userId);
        ApiResponse<TransactionResponse> response = ApiResponse.<TransactionResponse>builder()
                .success(true)
                .data(transaction)
                .message("Transaction created successfully")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ------------------- GET ALL USER TRANSACTIONS -------------------
    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getUserTransactions(
            @RequestHeader("X-User-Id") Long userId
    ) {
        List<TransactionResponse> transactions = service.getUserTransactions(userId);
        ApiResponse<List<TransactionResponse>> response = ApiResponse.<List<TransactionResponse>>builder()
                .success(true)
                .data(transactions)
                .message("Transactions retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // ------------------- GET USER TRANSACTIONS BY CATEGORY -------------------
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getByCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String category
    ) {
        List<TransactionResponse> transactions = service.getUserTransactionsByCategory(userId, category);
        ApiResponse<List<TransactionResponse>> response = ApiResponse.<List<TransactionResponse>>builder()
                .success(true)
                .data(transactions)
                .message("Transactions retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // ------------------- GET TRANSACTION BY ID -------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getById(@PathVariable Long id) {
        TransactionResponse transaction = service.getById(id);
        ApiResponse<TransactionResponse> response = ApiResponse.<TransactionResponse>builder()
                .success(true)
                .data(transaction)
                .message("Transaction retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // ------------------- DELETE TRANSACTION -------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        service.deleteTransaction(id);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .data(null)
                .message("Transaction deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}

