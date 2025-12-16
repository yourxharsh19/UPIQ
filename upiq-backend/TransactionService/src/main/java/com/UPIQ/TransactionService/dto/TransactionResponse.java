package com.UPIQ.TransactionService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Long userId;
    private Double amount;
    private String type;
    private String category;
    private String description;
    private LocalDateTime date;
    private String paymentMethod;
}

