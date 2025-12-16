package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class RegressionTest3 {

    private final AIPDFParserService parserService = new AIPDFParserService();

    @Test
    public void testDatePrefixedTransaction() {
        // Many statements have "Date Paid to Name Amount" on one line
        // Current logic uses startsWith("paid to") which fails here
        String input = "25 Oct 2025 Paid to Zomato ₹ 450.00";
        List<String> block = Arrays.asList(input);

        // We simulate the service processing this line.
        // Note: The service uses split logic in parseTransactions, but here we test
        // parseBlock?
        // Actually, if split logic fails, parseBlock might receive a merged block or
        // single line.
        // If we test parseBlock directly, it should pass if extraction logic finds
        // "Paid to" anywhere.
        // But the FAILURE the user sees (0 transactions) implies the split logic is
        // failing to identifying it as a transaction block.

        // So we should verify parseBlock handles it, AND we should probably verify
        // splitting logic if we could (method is private).
        // Let's rely on parseBlock correctness first.

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx, "Should parse despite date prefix");
        assertEquals("expense", tx.getType());
        assertTrue(tx.getDescription().contains("Zomato"));
    }
}
