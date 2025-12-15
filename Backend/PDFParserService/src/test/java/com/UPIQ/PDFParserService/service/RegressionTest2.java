package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class RegressionTest2 {

    private final AIPDFParserService parserService = new AIPDFParserService();

    @Test
    public void testSentToPattern() {
        // "Sent to" is a valid DEBIT keyword in determineType, but current
        // extractDescription usually misses it
        List<String> block = Arrays.asList(
                "Sent to Friend",
                "₹ 100.00",
                "12 Dec 2025");

        TransactionRequest tx = parserService.parseBlock(block);
        // Currently, this likely returns null because isValid checks description !=
        // "Transaction"
        assertNotNull(tx, "Should parse 'Sent to' transaction");
        assertEquals("expense", tx.getType());
        assertTrue(tx.getDescription().contains("Sent to") || tx.getDescription().contains("Friend"));
    }

    @Test
    public void testPurchasePattern() {
        // "Purchase" is a valid DEBIT keyword
        List<String> block = Arrays.asList(
                "Purchase at Store",
                "₹ 200.00",
                "12 Dec 2025");

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx, "Should parse 'Purchase' transaction");
        assertEquals("expense", tx.getType());
    }

    @Test
    public void testCreditedPattern() {
        // "Credited" is a valid CREDIT keyword
        List<String> block = Arrays.asList(
                "Credited from Salary",
                "₹ 50000.00",
                "01 Dec 2025");

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx, "Should parse 'Credited' transaction");
        assertEquals("income", tx.getType());
    }
}
