package com.SmartSpend.PDFParserService.Service;

import com.SmartSpend.PDFParserService.DTO.ParsingResponse;
import com.SmartSpend.PDFParserService.DTO.TransactionRequest;
import com.SmartSpend.PDFParserService.Exception.ParsingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParserService {

    private final FileValidationService validationService;
    private final AIPDFParserService pdfParserService;
    private final CSVParserService csvParserService;

    public ParsingResponse parseFile(MultipartFile file) {
        // Validate file first
        validationService.validateFile(file);

        List<TransactionRequest> transactions;
        List<String> errors = new ArrayList<>();
        int successfulParses = 0;
        int failedParses = 0;
        int totalTransactions = 0;

        try {
            if (validationService.isPDF(file)) {
                log.info("Parsing PDF file: {}", file.getOriginalFilename());
                transactions = pdfParserService.parsePDF(file);
            } else if (validationService.isCSV(file)) {
                log.info("Parsing CSV file: {}", file.getOriginalFilename());
                transactions = csvParserService.parseCSV(file);
            } else {
                throw new ParsingException("Unsupported file type. Only PDF and CSV files are allowed");
            }

            // Store total count BEFORE filtering
            totalTransactions = transactions.size();

            // Count successful and failed parses
            for (TransactionRequest tx : transactions) {
                if (tx != null && tx.getAmount() != null && tx.getAmount() > 0) {
                    successfulParses++;
                } else {
                    failedParses++;
                    errors.add("Invalid transaction: " + (tx != null ? tx.getDescription() : "null"));
                }
            }

            // Filter out invalid transactions
            transactions.removeIf(tx -> tx == null || tx.getAmount() == null || tx.getAmount() <= 0);

        } catch (ParsingException e) {
            log.error("Parsing error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during parsing: {}", e.getMessage(), e);
            throw new ParsingException("Failed to parse file: " + e.getMessage(), e);
        }

        String message = String.format(
                "Successfully parsed %d transactions from %s",
                successfulParses,
                file.getOriginalFilename()
        );

        return ParsingResponse.builder()
                .totalTransactions(totalTransactions)
                .successfulParses(successfulParses)
                .failedParses(failedParses)
                .transactions(transactions)
                .errors(errors)
                .message(message)
                .build();
    }
}

