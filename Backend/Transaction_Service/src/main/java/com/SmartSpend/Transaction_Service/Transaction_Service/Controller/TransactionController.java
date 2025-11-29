package com.SmartSpend.Transaction_Service.Transaction_Service.Controller;

import com.SmartSpend.Transaction_Service.Transaction_Service.DTO.TransactionRequest;
import com.SmartSpend.Transaction_Service.Transaction_Service.Model.Transaction;
import com.SmartSpend.Transaction_Service.Transaction_Service.Service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<Transaction> add(
            @Valid @RequestBody TransactionRequest request,
            @RequestHeader("userId") Long userId
    ) {
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setType(request.getType());
        transaction.setUserId(userId);

        return ResponseEntity.ok(service.addTransaction(transaction));
    }

    // ------------------- GET ALL USER TRANSACTIONS -------------------
    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(
            @RequestHeader("userId") Long userId
    ) {
        return ResponseEntity.ok(service.getUserTransactions(userId));
    }

    // ------------------- GET USER TRANSACTIONS BY CATEGORY -------------------
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Transaction>> getByCategory(
            @RequestHeader("userId") Long userId,
            @PathVariable String category
    ) {
        return ResponseEntity.ok(service.getUserTransactionsByCategory(userId, category));
    }
    // ------------------- GET TRANSACTION BY ID -------------------
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ------------------- DELETE TRANSACTION -------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
