package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class TransactionPatternTest {

    private final AIPDFParserService parserService = new AIPDFParserService();

    @Test
    public void testExpensePattern_PaidByAndPaidTo() {
        // Requirements:
        // EXPENSE when: Statement contains “Paid by {BankName}” AND “Paid to
        // {ReceiverName}”
        // Description: Paid to {ReceiverName}

        List<String> block = Arrays.asList(
                "Paid by HDFC Bank",
                "Paid to Zomato",
                "₹ 450.00",
                "12 Dec 2025",
                "Dinner");

        TransactionRequest tx = parserService.parseBlock(block);

        System.out.println("DEBUG EXPENSE: Type=" + (tx != null ? tx.getType() : "null") +
                ", Desc='" + (tx != null ? tx.getDescription() : "null") + "'");

        assertNotNull(tx);
        assertEquals("expense", tx.getType());
        assertEquals("Paid to Zomato", tx.getDescription());
    }

    @Test
    public void testIncomePattern_PaidToBank_ReceivedFrom() {
        // Requirements:
        // INCOME when: Statement contains “Paid to {BankName}” AND “Received from
        // {SenderName}”
        // Description: Received from {SenderName}

        List<String> block = Arrays.asList(
                "Paid to HDFC Bank",
                "Received from Rahul Kumar",
                "₹ 2000.00",
                "12 Dec 2025");

        TransactionRequest tx = parserService.parseBlock(block);

        System.out.println("DEBUG INCOME: Type=" + (tx != null ? tx.getType() : "null") +
                ", Desc='" + (tx != null ? tx.getDescription() : "null") + "'");

        assertNotNull(tx);
        assertEquals("income", tx.getType());
        assertEquals("Received from Rahul Kumar", tx.getDescription());
    }
}
