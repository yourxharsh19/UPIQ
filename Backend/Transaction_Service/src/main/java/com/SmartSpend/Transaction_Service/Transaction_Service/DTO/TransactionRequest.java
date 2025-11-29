package com.SmartSpend.Transaction_Service.Transaction_Service.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class TransactionRequest {
    @NotNull(message = "Amount is required")
    private Double amount;

    @NotEmpty(message = "Type is required")
    private String type;

    @NotEmpty(message = "Category is required")
    private String category;

    private String description;
}
