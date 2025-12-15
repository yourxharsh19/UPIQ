package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class RegressionTest5 {

    private final AIPDFParserService parserService = new AIPDFParserService();

    @Test
    public void testPaidToZomatoWithBankDetails() {
        // SCENARIO A: Expense
        // "Paid to Zomato" -> Expense. But block contains "HDFC Bank" (in UPI ID or
        // ref).
        // Must NOT match BANK_PATTERN for Income.
        List<String> block = Arrays.asList(
                "Paid to Zomato",
                "₹ 200.00",
                "Debited from HDFC Bank",
                "UPI ID: zomato@okhdfcbank");

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx);
        assertEquals("expense", tx.getType(), "Zomato transaction should be expense even if HDFC mentioned");
    }

    @Test
    public void testPaidToBankOfIndia() {
        // SCENARIO B: Income (Credit/Refund/Self-Transfer)
        // "Paid to Bank of India" -> User says this is Income.
        // Must MATCH BANK_PATTERN for Income.
        List<String> block = Arrays.asList(
                "Paid to Bank of India",
                "₹ 3000.00",
                "12 Dec 2025");

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx);
        assertEquals("income", tx.getType(), "Paid to Bank of India should be INCOME/CREDIT");
    }

    @Test
    public void testPaidToMyBankName() {
        // SCENARIO C: Generic Bank
        List<String> block = Arrays.asList(
                "Paid to MyBankName",
                "₹ 5000.00");
        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx);
        assertEquals("income", tx.getType(), "Paid to MyBankName should be INCOME");
    }
}
