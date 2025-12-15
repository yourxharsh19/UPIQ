package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class RegressionTest {

    private final AIPDFParserService parserService = new AIPDFParserService();

    @Test
    public void testMultilineDescription() {
        // "Paid to" is separate from the name matching expected strict logic
        // If the code expects "Paid to X" on one line, this will fail
        List<String> block = Arrays.asList(
                "Paid to",
                "Zomato Limited",
                "₹ 450.00",
                "12 Dec 2025");

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx, "Should parse split lines");
        assertEquals("Paid to Zomato Limited", tx.getDescription(), "Should combine or find name on next line");
    }

    @Test
    public void testTotalInName() {
        // "Total" is in the ignore list. "Total Gas" shouldn't be ignored entirely?
        // But ignore list works on lines. if line is "Total Gas", it might be ignored.
        List<String> block = Arrays.asList(
                "Paid to",
                "Total Gas",
                "₹ 1000.00",
                "12 Dec 2025");

        // If "Total Gas" is filtered out during line reading, extraction will fail
        // However, parseBlock receives the block. The filtering happens in
        // parseTransactions.
        // But for this unit test we pass the block directly.
        // So we need to test if `extractDescription` handles "Total Gas" or if it gets
        // skipped there?
        // Actually, parseTransactions does the filtering.
        // Let's rely on manual inspection of code for filtering logic, but test
        // description extraction here.

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx);
        assertEquals("Paid to Total Gas", tx.getDescription());
    }

    @Test
    public void testStrictPaidToMissing() {
        // Case where "Paid to" text is present but might be "Paid to you" (which should
        // be skipped or Credit)
        List<String> block = Arrays.asList(
                "Paid to you",
                "From Friend",
                "₹ 500.00");
        TransactionRequest tx = parserService.parseBlock(block);
        // Should be ignored or CREDIT
        if (tx != null) {
            assertEquals("income", tx.getType());
            // Description might be tricky logic
        }
    }
}
