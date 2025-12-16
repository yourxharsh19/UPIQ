package com.UPIQ.PDFParserService.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AIPDFParserServiceTest {

    @Test
    public void testDetermineTransactionType_PaidToMyBankName_ShouldBeCredit() {
        AIPDFParserService service = new AIPDFParserService();
        
        // This is the case reporting the bug: "Paid to myBankName" -> Misclassified as Expense (DEBIT)
        String description = "Paid to myBankName";
        
        String result = service.determineTransactionType(description);
        
        // We expect CREDIT (Income) for transfers to own bank
        assertEquals("CREDIT", result, "Transaction 'Paid to myBankName' should be classified as CREDIT");
    }

    @Test
    public void testDetermineTransactionType_PaidToOther_ShouldBeDebit() {
        AIPDFParserService service = new AIPDFParserService();
        String description = "Paid to MerchantXYZ";
        String result = service.determineTransactionType(description);
        assertEquals("DEBIT", result);
    }
}
