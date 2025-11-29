package com.SmartSpend.Transaction_Service.Transaction_Service.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;             // user making the transaction

    private double amount;

    private String type;             // income/expense or credit/debit

    private String category;         // Food, Travel, Bills, etc.

    private String description;

    private LocalDateTime date = LocalDateTime.now();

    private String paymentMethod;    // UPI, Cash, Card
}
