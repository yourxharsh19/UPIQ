package com.UPIQ.PDFParserService.service;

import com.UPIQ.PDFParserService.dto.TransactionRequest;
import com.UPIQ.PDFParserService.exceptions.ParsingException;
import com.UPIQ.PDFParserService.utils.ParsingUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIPDFParserService {

    private static final Pattern CURRENCY_PATTERN = Pattern.compile("(?:₹|rs\\.?|inr)\\s*([\\d,]+(?:\\.\\d{1,2})?)",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DATE_PATTERN = Pattern.compile(
            "\\b(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})\\b|(\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{2,4})",
            Pattern.CASE_INSENSITIVE);

    // Fixed: Restored "Paid to" triggers but restricted Bank Name matching to avoid
    // false positives.
    // Matches "Paid to HDFC", "Paid to Bank of India", "Paid to My Bank".
    // Does NOT match "Paid to Zomato ... okhdfcbank" (because of non-greedy
    // matching and whitespace limits).
    private static final Pattern BANK_PATTERN = Pattern.compile(
            "(?i)(?:paid to|payment to|credited to|credit to)\\s+" +
                    "(?:mybankname|bank\\s+of\\s+\\w+|state\\s+bank|hdfc|icici|axis|sbi|pnb|kotak|yes\\s+bank|idfc|hsbc|citibank|union\\s+bank|canara\\s+bank|central\\s+bank|indusind|rbl|federal\\s+bank|(?:[\\w']+\\s+){0,2}bank\\b)");

    private static final Set<String> IGNORE_PATTERNS = Set.of("opening balance", "closing balance", "date & time",
            "page", "statement");

    // Standard formatters
    private static final List<DateTimeFormatter> DATE_FORMATTERS = Arrays.asList(
            DateTimeFormatter.ofPattern("dd/MM/yyyy"), DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yy"), DateTimeFormatter.ofPattern("dd-MM-yy"),
            DateTimeFormatter.ofPattern("dd MMM yyyy"), DateTimeFormatter.ofPattern("dd MMM yy"));

    public List<TransactionRequest> parsePDF(MultipartFile file) {
        log.info("Starting PDF parsing for file: {}", file.getOriginalFilename());
        try (InputStream inputStream = file.getInputStream();
                PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {

            String text = new PDFTextStripper().getText(document);
            if (text == null || text.trim().isEmpty()) {
                log.warn("PDF extracted text is empty");
                throw new ParsingException("Empty PDF");
            }
            log.debug("Extracted text length: {}", text.length());
            return parseTransactions(text);
        } catch (IOException e) {
            log.error("Error reading PDF", e);
            throw new ParsingException("Error reading PDF: " + e.getMessage(), e);
        }
    }

    private List<TransactionRequest> parseTransactions(String text) {
        // Pre-process: Normalize spaces to ensure regex matching works reliably
        List<String> lines = Arrays.stream(text.split("\\r?\\n"))
                .map(line -> line.replaceAll("[\\u00A0\\s]+", " ").trim())
                .filter(line -> !line.isEmpty() && !IGNORE_PATTERNS.stream().anyMatch(line.toLowerCase()::contains))
                .collect(Collectors.toList());

        log.info("Processing {} lines after filtering", lines.size());

        List<TransactionRequest> transactions = new ArrayList<>();
        List<String> currentBlock = new ArrayList<>();

        for (String line : lines) {
            String lower = line.toLowerCase();
            // Robust start detection logic (contains)
            boolean isStart = lower.contains("paid to") || lower.contains("received from")
                    || (lower.contains("debited") && !lower.contains("debited from"))
                    || lower.contains("credited to")
                    || lower.contains("sent to") || lower.contains("purchase")
                    || lower.contains("payment to");

            if (isStart && !currentBlock.isEmpty()) {
                addTx(transactions, currentBlock);
                currentBlock.clear();
            }
            currentBlock.add(line);
        }
        addTx(transactions, currentBlock);

        log.info("Parsed {} transactions", transactions.size());
        return transactions;
    }

    private void addTx(List<TransactionRequest> transactions, List<String> block) {
        TransactionRequest tx = parseBlock(block);
        if (tx != null) {
            if (isValid(tx)) {
                transactions.add(tx);
            } else {
                log.info("Dropping invalid transaction: Amount={}, Desc='{}'", tx.getAmount(), tx.getDescription());
            }
        }
    }

    TransactionRequest parseBlock(List<String> block) {
        if (block == null || block.isEmpty())
            return null;
        String combined = String.join(" ", block);
        String lower = combined.toLowerCase();

        if (lower.contains("paid to and") && lower.contains("received from and"))
            return null;

        String type = determineTransactionType(combined);
        if ("UNKNOWN".equals(type))
            return null;

        String finalType = "CREDIT".equals(type) ? "income" : "expense";
        Double amount = extractAmount(combined);
        if (amount == null)
            return null;

        TransactionRequest tx = new TransactionRequest();
        tx.setType(finalType);
        tx.setAmount(amount);
        tx.setDate(extractDate(combined));
        tx.setDescription(extractDescription(block, type));
        tx.setPaymentMethod(lower.contains("cash") ? "CASH" : "UPI");

        return tx;
    }

    String determineTransactionType(String text) {
        String lower = text.toLowerCase();
        // Credit
        if (lower.contains("received from") || lower.contains("credited") ||
                lower.contains("refund") || lower.contains("cashback") ||
                lower.contains("paid to you"))
            return "CREDIT";

        if (BANK_PATTERN.matcher(text).find())
            return "CREDIT";

        // Debit
        if (lower.contains("paid to") || lower.contains("debited") ||
                lower.contains("sent to") || lower.contains("purchase") ||
                lower.contains("payment to"))
            return "DEBIT";

        return "UNKNOWN";
    }

    private String extractDescription(List<String> block, String type) {
        String combined = String.join(" ", block).trim();
        String name = null;
        String lower = combined.toLowerCase();

        if ("DEBIT".equals(type)) {
            Pattern p = Pattern.compile(
                    "(?:paid to|sent to|transfer to|payment to|pay to)\\s+([A-Za-z0-9\\s&.,'-]+?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12}|\\d{1,2}[/-]\\d{1,2})|$)",
                    Pattern.CASE_INSENSITIVE);
            Matcher m = p.matcher(combined);
            if (m.find()) {
                name = cleanName(m.group(1), "");
                if (!name.isEmpty() && !name.toLowerCase().matches(".*(?:bank|account|wallet|your).*")) {
                    return "Paid to " + name;
                }
            }

            String[] debitKeywords = { "paid to", "sent to", "debited", "purchase", "payment to" };
            for (String line : block) {
                for (String kw : debitKeywords) {
                    if (line.toLowerCase().contains(kw)) {
                        String clean = cleanName(line, kw);
                        if (!clean.isEmpty())
                            return formatDesc(kw, clean);
                    }
                }
            }
        } else { // CREDIT
            Pattern p = Pattern.compile(
                    "(?:received from|credited from|credit from|received)\\s+([A-Za-z0-9\\s&.,'-]+?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12}|\\d{1,2}[/-]\\d{1,2})|$)",
                    Pattern.CASE_INSENSITIVE);
            Matcher m = p.matcher(combined);
            if (m.find()) {
                name = cleanName(m.group(1), "");
                if (!name.isEmpty() && !name.toLowerCase().matches(".*(?:bank|account|wallet|your).*")) {
                    return "Received from " + name;
                }
            }

            // Fallback keywords check per line
            String[] creditKeywords = { "received from", "credited", "refund", "cashback" };
            for (String line : block) {
                for (String kw : creditKeywords) {
                    if (line.toLowerCase().contains(kw)) {
                        String clean = cleanName(line, kw);
                        if (!clean.isEmpty())
                            return formatDesc(kw, clean);
                    }
                }
            }
            // Support "Paid to Bank..." which was classified as CREDIT
            // We want "Paid to Bank" description to be clean
            if (lower.startsWith("paid to") || lower.startsWith("payment to")) {
                String[] bankKeywords = { "paid to", "payment to" };
                for (String line : block) {
                    for (String kw : bankKeywords) {
                        if (line.toLowerCase().contains(kw)) {
                            String clean = cleanName(line, kw);
                            if (!clean.isEmpty())
                                return formatDesc(kw, clean);
                        }
                    }
                }
            }
        }

        return "Transaction";
    }

    private String formatDesc(String keyword, String name) {
        String cap = Character.toUpperCase(keyword.charAt(0)) + keyword.substring(1);
        return cap + " " + name;
    }

    private boolean isNoise(String line) {
        return CURRENCY_PATTERN.matcher(line).find() || DATE_PATTERN.matcher(line).find()
                || line.toLowerCase().contains("upi id");
    }

    private String cleanName(String line, String keyword) {
        int idx = 0;
        if (!keyword.isEmpty()) {
            idx = line.toLowerCase().indexOf(keyword);
            if (idx == -1)
                return line.trim();
            idx += keyword.length();
        }

        String raw = line.substring(idx).trim();
        return raw.replaceAll("(?i)(?:upi|ref|id|rs|inr|₹).*$", "")
                .replaceAll("\\d.*$", "")
                .replaceAll("[-–].*$", "")
                .trim();
    }

    private Double extractAmount(String text) {
        Matcher m = CURRENCY_PATTERN.matcher(text);
        while (m.find()) {
            try {
                String val = m.group(1).replace(",", "");
                double d = Double.parseDouble(val);
                if (d > 0 && d < 1000000)
                    return d;
            } catch (Exception e) {
                /* ignore */ }
        }
        return null;
    }

    private LocalDateTime extractDate(String text) {
        Matcher m = DATE_PATTERN.matcher(text);
        if (m.find()) {
            String s = m.group(1) != null ? m.group(1) : m.group(2);
            for (DateTimeFormatter fmt : DATE_FORMATTERS) {
                try {
                    return LocalDate.parse(s, fmt).atStartOfDay();
                } catch (Exception e) {
                }
            }
        }
        return LocalDateTime.now();
    }

    private boolean isValid(TransactionRequest tx) {
        return tx.getAmount() != null;
    }
}
