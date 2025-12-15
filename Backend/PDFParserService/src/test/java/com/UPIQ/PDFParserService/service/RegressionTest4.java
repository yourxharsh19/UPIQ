package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class RegressionTest4 {

    private final AIPDFParserService parserService = new AIPDFParserService();

    @Test
    public void testPaidToWithBankInText() {
        // "Paid to" is DEBIT/Expense.
        // But if the block contains "Bank" (e.g. user's bank name, or UPI ID with bank
        // name)
        // the current BANK_PATTERN might misclassify it as CREDIT/Income.

        List<String> block = Arrays.asList(
                "Paid to Zomato",
                "₹ 200.00",
                "Debited from HDFC Bank", // "Bank" is present here!
                "UPI ID: zomato@okhdfcbank" // "bank" is present here too
        );

        TransactionRequest tx = parserService.parseBlock(block);
        assertNotNull(tx);

        // This assertion is expected to FAIL if the bug exists (it will be "income")
        assertEquals("expense", tx.getType(), "Should be expense even if 'Bank' is mentioned");
    }
}
