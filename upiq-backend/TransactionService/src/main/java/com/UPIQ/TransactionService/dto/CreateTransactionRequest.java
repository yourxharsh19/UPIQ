package com.UPIQ.TransactionService.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {
    
    @NotNull(message = "Amount is required")
    private Double amount;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "^(?i)(income|expense)$", message = "Type must be 'income' or 'expense'")
    private String type;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;
    
    private String paymentMethod;
}

