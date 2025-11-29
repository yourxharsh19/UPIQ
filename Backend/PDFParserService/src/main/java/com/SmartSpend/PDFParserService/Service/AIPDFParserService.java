package com.SmartSpend.PDFParserService.Service;

import com.SmartSpend.PDFParserService.DTO.TransactionRequest;
import com.SmartSpend.PDFParserService.Exception.ParsingException;
import com.SmartSpend.PDFParserService.Utils.ParsingUtils;
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
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIPDFParserService {

    private static final Pattern UPI_ID_PATTERN = Pattern.compile("\\b\\d{12}\\b");
    private static final Pattern VPA_PATTERN = Pattern.compile("\\b[\\w.]+@[\\w]+\\b");
    private static final Pattern CURRENCY_AMOUNT_PATTERN = Pattern.compile("(?:₹|rs\\.?|inr)\\s*([\\d,]+(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE);
    private static final Pattern DATE_PATTERN = Pattern.compile("\\b(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})\\b|(\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{2,4})", Pattern.CASE_INSENSITIVE);
    private static final Pattern HEADER_PATTERN = Pattern.compile("(?i)(?:date\\s*&?\\s*time|transaction\\s+details|page\\s+\\d+\\s+of\\s+\\d+|statement\\s+period|account\\s+summary|will\\s+not\\s+show\\s+up)");
    private static final Pattern SUMMARY_PATTERN = Pattern.compile("(?i)(?:total|sum)\\s+(?:spend|spent|received|income|expense|amount)");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b\\d{10}\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b");
    private static final Pattern DATE_ONLY_PATTERN = Pattern.compile("^(?:received from|paid to)\\s+(?:\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{2,4}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})\\s*(?:\\d{1,2}:\\d{2}\\s*(?:AM|PM))?\\s*$", Pattern.CASE_INSENSITIVE);
    private static final Pattern HEADER_DESCRIPTION_PATTERN = Pattern.compile("(?i)(?:paid to and|received from and).*\\d{1,2}\\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}\\s*-\\s*\\d{1,2}\\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}.*(?:sent|receiv|received|sent receiv)");

    private static final Set<String> DEBIT_KEYWORDS = Set.of("paid to", "debited", "sent to", "payment to", "debit", "paid", "purchase", "merchant payment");
    private static final Set<String> CREDIT_KEYWORDS = Set.of("received from", "credited", "credit", "refund", "cashback", "reversal");
    private static final Set<String> SKIP_PATTERNS = Set.of("opening balance", "closing balance", "total debits", "total credits", "date & time", "transaction details", "page", "statement period", "s.no", "serial no", "total spend", "total received");
    private static final Pattern BANK_PATTERN = Pattern.compile("(?i)(?:paid to|payment to|credited to|credit to)\\s+(?:bank|bank of|state bank|hdfc|icici|axis|sbi|pnb|union bank|canara|indian bank|indian overseas bank|boi|bank of india|bank of baroda|kotak|yes bank|idfc|rbl|dbs|hsbc|citibank)");

    private static final List<DateTimeFormatter> DATE_FORMATTERS = Arrays.asList(
            DateTimeFormatter.ofPattern("dd/MM/yyyy"), DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yy"), DateTimeFormatter.ofPattern("dd-MM-yy"),
            DateTimeFormatter.ofPattern("dd MMM yyyy"), DateTimeFormatter.ofPattern("dd MMM yy")
    );

    public List<TransactionRequest> parsePDF(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            
            PDFTextStripper textStripper = new PDFTextStripper();
            String fullText = textStripper.getText(document);
            
            if (fullText == null || fullText.trim().isEmpty()) {
                throw new ParsingException("PDF file contains no extractable text.");
            }
            
            return parseTransactionsFromText(fullText);
        } catch (IOException e) {
            throw new ParsingException("Failed to read PDF file: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new ParsingException("Failed to parse PDF: " + e.getMessage(), e);
        }
    }

    private List<TransactionRequest> parseTransactionsFromText(String text) {
        List<String> lines = Arrays.stream(text.split("\\r?\\n"))
                .map(String::trim)
                .filter(line -> !line.isEmpty() && isNotNoisePattern(line))
                .collect(Collectors.toList());

        List<TransactionRequest> transactions = new ArrayList<>();
        transactions.addAll(parseTransactionBlocks(groupTransactionBlocks(lines)));
        
        for (String line : lines) {
            if (looksLikeTransaction(line)) {
                TransactionRequest tx = parseBlock(Collections.singletonList(line));
                if (tx != null && isValidTransaction(tx) && !isDuplicate(transactions, tx)) {
                    transactions.add(tx);
                }
            }
        }
        
        return transactions;
    }

    private List<TransactionRequest> parseTransactionBlocks(List<List<String>> blocks) {
        List<TransactionRequest> transactions = new ArrayList<>();
        for (List<String> block : blocks) {
            try {
                TransactionRequest tx = parseBlock(block);
                if (tx != null && isValidTransaction(tx)) {
                    transactions.add(tx);
                }
            } catch (Exception e) {
                log.debug("Failed to parse block: {}", e.getMessage());
            }
        }
        return transactions;
    }

    private TransactionRequest parseBlock(List<String> block) {
        if (block == null || block.isEmpty()) return null;
        
        String combined = String.join(" ", block);
        String lower = combined.toLowerCase();
        
        if (HEADER_PATTERN.matcher(combined).find() || SUMMARY_PATTERN.matcher(combined).find() ||
            HEADER_DESCRIPTION_PATTERN.matcher(combined).find() ||
            lower.contains("date & time") || lower.contains("will not show up")) {
            return null;
        }
        
        // Check for header-like patterns with "paid to and" or "received from and" with date ranges
        if ((lower.contains("paid to and") || lower.contains("received from and")) &&
            lower.matches(".*\\d{1,2}\\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}\\s*-\\s*\\d{1,2}\\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}.*")) {
            if (lower.contains("sent") || lower.contains("receiv")) {
                return null;
            }
        }
        
        boolean hasPhone = PHONE_PATTERN.matcher(combined).find();
        boolean hasEmail = EMAIL_PATTERN.matcher(combined).find();
        if (hasPhone && hasEmail && combined.replaceAll("\\b\\d{10}\\b", "").replaceAll(EMAIL_PATTERN.pattern(), "").trim().length() < 5) {
            return null;
        }

        TransactionRequest tx = new TransactionRequest();
        String type = determineTransactionType(combined);
        String finalType = "CREDIT".equals(type) ? "income" : "DEBIT".equals(type) ? "expense" : "expense";
        tx.setType(finalType);
        
        // Debug log for type detection
        if (log.isDebugEnabled()) {
            log.debug("Transaction type detected: {} -> {} for text: {}", type, finalType, combined.substring(0, Math.min(100, combined.length())));
        }
        tx.setAmount(extractAmount(combined));
        tx.setDate(extractDate(combined));
        
        String upiId = extractUPIId(combined);
        String description = extractDescription(combined, type);
        String refNumber = extractRefNumber(combined);
        
        StringBuilder desc = new StringBuilder(description);
        List<String> details = new ArrayList<>();
        if (upiId != null && !description.contains(upiId)) details.add("UPI ID: " + upiId);
        if (refNumber != null && !description.contains(refNumber)) details.add("Ref: " + refNumber);
        if (!details.isEmpty()) desc.append(" [").append(String.join(", ", details)).append("]");
        
        tx.setDescription(desc.toString());
        tx.setPaymentMethod(lower.contains("cash") ? "CASH" : "UPI");
        return tx;
    }

    private String determineTransactionType(String text) {
        if (text == null || text.trim().isEmpty()) return "UNKNOWN";
        
        String lower = text.toLowerCase();
        
        // PRIORITY 1: Check for "received from" FIRST - this is always CREDIT (income)
        if (lower.contains("received from")) {
            return "CREDIT";
        }
        
        // PRIORITY 2: Check for "Paid to Bank" - this is usually CREDIT (bank crediting your account)
        if (BANK_PATTERN.matcher(text).find()) {
            return "CREDIT";
        }
        
        // PRIORITY 3: Check for other credit-specific patterns
        if (lower.contains("paid to you") || lower.contains("credited") || 
            lower.contains("refund") || lower.contains("cashback") || 
            lower.contains("reversal") || lower.contains("received money")) {
            return "CREDIT";
        }
        
        // PRIORITY 4: Check for debit-specific patterns (but exclude "paid to you" and bank payments)
        if (lower.contains("paid to") && !lower.contains("paid to you") && !BANK_PATTERN.matcher(text).find()) {
            return "DEBIT";
        }
        if (lower.contains("debited") || lower.contains("sent to") || 
            lower.contains("payment to") || lower.contains("purchase") || 
            lower.contains("merchant payment")) {
            // But exclude if it's a bank transaction
            if (!BANK_PATTERN.matcher(text).find()) {
                return "DEBIT";
            }
        }
        
        // PRIORITY 5: Check for generic keywords
        if (lower.contains("credit") && !lower.contains("debit")) {
            return "CREDIT";
        }
        if (lower.contains("debit") && !lower.contains("credit")) {
            return "DEBIT";
        }
        
        // PRIORITY 6: Check for signs and abbreviations
        if (lower.contains("+") || lower.contains(" cr ") || lower.endsWith(" cr")) {
            return "CREDIT";
        }
        if (lower.contains("-") || lower.contains(" dr ") || lower.endsWith(" dr")) {
            return "DEBIT";
        }
        
        // PRIORITY 7: Check for "received" (without "from" - less specific)
        if (lower.contains("received") && !lower.contains("paid") && !lower.contains("sent")) {
            return "CREDIT";
        }
        
        // PRIORITY 8: Check for "paid" (generic) - but exclude bank payments
        if (lower.contains("paid") && !lower.contains("paid to you") && !BANK_PATTERN.matcher(text).find()) {
            return "DEBIT";
        }
        
        return "UNKNOWN";
    }

    private Double extractAmount(String text) {
        if (text == null || text.trim().isEmpty()) return null;

        Set<String> excludedNumbers = new HashSet<>();
        Matcher upiMatcher = UPI_ID_PATTERN.matcher(text);
        while (upiMatcher.find()) excludedNumbers.add(upiMatcher.group());
        
        Pattern.compile("\\b(?:ref|reference|utr|account|a/c|mobile|phone)[\\s:]*([0-9]{9,18})\\b", Pattern.CASE_INSENSITIVE)
                .matcher(text).results().forEach(m -> excludedNumbers.add(m.group(1)));

        Matcher currencyMatcher = CURRENCY_AMOUNT_PATTERN.matcher(text);
        while (currencyMatcher.find()) {
            String amountStr = currencyMatcher.group(1);
            if (amountStr != null) {
                try {
                    String cleaned = amountStr.replace(",", "").trim();
                    if (excludedNumbers.contains(cleaned) || cleaned.length() == 12 || cleaned.length() > 10) continue;
                    
                    double value = Double.parseDouble(cleaned);
                    int start = Math.max(0, currencyMatcher.start() - 30);
                    int end = Math.min(text.length(), currencyMatcher.end() + 30);
                    String context = text.substring(start, end).toLowerCase();
                    
                    if ((context.contains("balance") || context.contains("account")) && 
                        !context.matches(".*(?:paid|received|transaction).*")) continue;
                    
                    if (ParsingUtils.isValidAmount(value) && value > 1.0 && value < 1000000.0) {
                        return value;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }

    private LocalDateTime extractDate(String text) {
        Matcher matcher = DATE_PATTERN.matcher(text);
        while (matcher.find()) {
            String dateStr = matcher.group(1) != null ? matcher.group(1) : matcher.group(2);
            for (DateTimeFormatter formatter : DATE_FORMATTERS) {
                try {
                    return LocalDate.parse(dateStr, formatter).atStartOfDay();
                } catch (DateTimeParseException ignored) {}
            }
        }
        return LocalDateTime.now();
    }

    private String extractUPIId(String text) {
        Matcher matcher = UPI_ID_PATTERN.matcher(text);
        while (matcher.find()) {
            if (!text.substring(Math.max(0, matcher.start() - 5), matcher.start()).toLowerCase().contains("mobile")) {
                return matcher.group();
            }
        }
        return null;
    }

    private String extractRefNumber(String text) {
        Matcher matcher = Pattern.compile("\\b(?:ref|reference|utr|order|txn)[\\s:]*([0-9]{10,16})\\b", Pattern.CASE_INSENSITIVE).matcher(text);
        return matcher.find() ? matcher.group(1) : null;
    }

    private String extractDescription(String text, String type) {
        if (text == null || text.trim().isEmpty()) return "Transaction";

        String lower = text.toLowerCase();
        String name = null;

        if ("DEBIT".equals(type)) {
            // Extract receiver name (who we paid to) - multiple patterns
            Pattern[] patterns = new Pattern[]{
                Pattern.compile("(?:paid to|sent to|payment to|transferred to|pay to)\\s+([A-Za-z0-9\\s&.,'-]+?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12}|\\d{1,2}[/-]\\d{1,2})|$)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("\\bto\\s+([A-Za-z][A-Za-z0-9\\s&.,'-]{2,50}?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12})|$)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(?:debited|debit)\\s+(?:from|to|for)\\s+([A-Za-z0-9\\s&.,'-]+?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12})|$)", Pattern.CASE_INSENSITIVE)
            };
            
            for (Pattern pattern : patterns) {
                Matcher m = pattern.matcher(text);
                if (m.find()) {
                    name = cleanName(m.group(1));
                    if (name != null && !name.isEmpty() && !name.toLowerCase().matches(".*(?:bank|account|wallet|your).*")) {
                        break;
                    }
                }
            }
            
            // Fallback: extract after debit keywords
            if (name == null || name.isEmpty()) {
                for (String keyword : DEBIT_KEYWORDS) {
                    int idx = lower.indexOf(keyword);
                    if (idx >= 0) {
                        String after = text.substring(idx + keyword.length()).trim();
                        name = extractFirstPhrase(after);
                        name = cleanName(name);
                        if (name != null && !name.isEmpty() && !name.equals("Unknown") && 
                            !name.toLowerCase().matches(".*(?:bank|account|wallet|your).*")) {
                            break;
                        }
                        name = null;
                    }
                }
            }
            
            // Extract VPA as fallback
            if ((name == null || name.isEmpty())) {
                Matcher vpaMatcher = VPA_PATTERN.matcher(text);
                if (vpaMatcher.find()) {
                    name = vpaMatcher.group();
                }
            }
            
            return name != null && !name.isEmpty() ? "Paid to " + name : "Transaction";
            
        } else if ("CREDIT".equals(type)) {
            // Extract sender name (who we received from) - multiple patterns
            Pattern[] patterns = new Pattern[]{
                Pattern.compile("(?:received from|credited from|credit from|received)\\s+([A-Za-z0-9\\s&.,'-]+?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12}|\\d{1,2}[/-]\\d{1,2})|$)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("\\bfrom\\s+([A-Za-z][A-Za-z0-9\\s&.,'-]{2,50}?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12})|$)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(?:credited|credit)\\s+(?:to|from|by)\\s+([A-Za-z0-9\\s&.,'-]+?)(?:\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12})|$)", Pattern.CASE_INSENSITIVE)
            };
            
            for (Pattern pattern : patterns) {
                Matcher m = pattern.matcher(text);
                if (m.find()) {
                    name = cleanName(m.group(1));
                    if (name != null && !name.isEmpty() && !name.toLowerCase().matches(".*(?:bank|account|wallet|your).*")) {
                        break;
                    }
                }
            }
            
            // Fallback: extract after credit keywords
            if (name == null || name.isEmpty()) {
                for (String keyword : CREDIT_KEYWORDS) {
                    int idx = lower.indexOf(keyword);
                    if (idx >= 0) {
                        String after = text.substring(idx + keyword.length()).trim();
                        name = extractFirstPhrase(after);
                        name = cleanName(name);
                        if (name != null && !name.isEmpty() && !name.equals("Unknown") && 
                            !name.toLowerCase().matches(".*(?:bank|account|wallet|your).*")) {
                            break;
                        }
                        name = null;
                    }
                }
            }
            
            // Extract VPA as fallback
            if ((name == null || name.isEmpty())) {
                Matcher vpaMatcher = VPA_PATTERN.matcher(text);
                if (vpaMatcher.find()) {
                    name = vpaMatcher.group();
                }
            }
            
            return name != null && !name.isEmpty() ? "Received from " + name : "Transaction";
        }

        return "Transaction";
    }

    private String extractFirstPhrase(String text) {
        String cleaned = text.replaceAll("\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}", "")
                .replaceAll("(?:Rs\\.?|INR|₹)\\s*[\\d,]+(?:\\.\\d{2})?", "")
                .replaceAll("\\b\\d{12}\\b", "").trim();
        String[] parts = cleaned.split("[\\n\\r]");
        String first = parts[0].trim();
        return first.length() > 50 ? first.substring(0, 50) : first;
    }

    private String cleanName(String name) {
        if (name == null || name.trim().isEmpty()) return null;
        String cleaned = name.trim()
                .replaceAll("(?i)^(?:mr|mrs|ms|dr)\\.?\\s+", "")
                .replaceAll("(?i)\\s+(?:upi|ref|id|amount|rs|inr|₹|\\d{12}).*$", "")
                .replaceAll("\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}", "")
                .replaceAll("(?:Rs\\.?|INR|₹)\\s*[\\d,]+(?:\\.\\d{2})?", "")
                .replaceAll("\\b\\d{12}\\b", "")
                .replaceAll("\\s+", " ").trim();
        return cleaned.isEmpty() ? null : (cleaned.length() > 100 ? cleaned.substring(0, 97) + "..." : cleaned);
    }

    private List<List<String>> groupTransactionBlocks(List<String> lines) {
        List<List<String>> blocks = new ArrayList<>();
        List<String> current = new ArrayList<>();
        for (String line : lines) {
            if (line.matches("[-=*]{3,}")) {
                if (!current.isEmpty()) { blocks.add(new ArrayList<>(current)); current.clear(); }
                continue;
            }
            String lower = line.toLowerCase();
            if ((DEBIT_KEYWORDS.stream().anyMatch(lower::startsWith) || 
                 CREDIT_KEYWORDS.stream().anyMatch(lower::startsWith)) && !current.isEmpty()) {
                blocks.add(new ArrayList<>(current));
                current.clear();
            }
            current.add(line);
        }
        if (!current.isEmpty()) blocks.add(new ArrayList<>(current));
        return blocks;
    }

    private boolean looksLikeTransaction(String line) {
        if (line == null || line.trim().isEmpty() || !isNotNoisePattern(line) || HEADER_PATTERN.matcher(line).find()) {
            return false;
        }
        String lower = line.toLowerCase();
        boolean hasKeyword = DEBIT_KEYWORDS.stream().anyMatch(lower::contains) || CREDIT_KEYWORDS.stream().anyMatch(lower::contains);
        boolean hasAmount = CURRENCY_AMOUNT_PATTERN.matcher(line).find();
        return hasKeyword && hasAmount && !lower.contains("date & time") && !lower.contains("transaction details");
    }

    private boolean isNotNoisePattern(String line) {
        if (line == null || line.trim().isEmpty()) return false;
        String lower = line.toLowerCase();
        if (SKIP_PATTERNS.stream().anyMatch(lower::contains) || HEADER_PATTERN.matcher(line).find()) return false;
        if (lower.matches(".*(?:page\\s+\\d+|\\d+\\s+of\\s+\\d+).*")) return false;
        if (lower.contains("date") && (lower.contains("time") || lower.contains("&")) && 
            (lower.contains("transaction") || lower.contains("details"))) return false;
        return true;
    }

    private boolean isValidTransaction(TransactionRequest tx) {
        if (tx == null || tx.getAmount() == null || !ParsingUtils.isValidAmount(tx.getAmount()) ||
            tx.getType() == null || tx.getType().equalsIgnoreCase("unknown")) {
            return false;
        }
        
        String description = tx.getDescription();
        if (description != null && !description.trim().isEmpty()) {
            String lowerDesc = description.toLowerCase();
            String trimmedDesc = description.trim();
            
            if (HEADER_PATTERN.matcher(description).find() || SUMMARY_PATTERN.matcher(description).find() ||
                DATE_ONLY_PATTERN.matcher(trimmedDesc).find() || HEADER_DESCRIPTION_PATTERN.matcher(description).find()) {
                return false;
            }
            
            // Check for header-like descriptions with date ranges and "Sent Receiv" pattern
            if (lowerDesc.contains("paid to and") || lowerDesc.contains("received from and")) {
                if (lowerDesc.matches(".*\\d{1,2}\\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}\\s*-\\s*\\d{1,2}\\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+\\d{2,4}.*")) {
                    if (lowerDesc.contains("sent") || lowerDesc.contains("receiv")) {
                        return false;
                    }
                }
            }
            
            boolean hasPhone = PHONE_PATTERN.matcher(trimmedDesc).find();
            boolean hasEmail = EMAIL_PATTERN.matcher(trimmedDesc).find();
            if (hasPhone && hasEmail && trimmedDesc.replaceAll("\\b\\d{10}\\b", "").replaceAll(EMAIL_PATTERN.pattern(), "").trim().length() < 5) {
                return false;
            }
            
            String descWithoutDates = trimmedDesc
                    .replaceAll("\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{2,4}", "")
                    .replaceAll("\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}", "")
                    .replaceAll("\\d{1,2}:\\d{2}\\s*(?:AM|PM)", "").trim();
            if (descWithoutDates.length() < 3 && trimmedDesc.matches(".*\\d{1,2}.*")) {
                return false;
            }
            
            if (lowerDesc.contains("date & time") || lowerDesc.contains("transaction details") ||
                (lowerDesc.contains("page") && lowerDesc.contains("of")) ||
                lowerDesc.contains("will not show up") || lowerDesc.contains("statement period")) {
                return false;
            }
        }
        return true;
    }

    private boolean isDuplicate(List<TransactionRequest> existing, TransactionRequest candidate) {
        return existing.stream().anyMatch(tx ->
                Objects.equals(tx.getAmount(), candidate.getAmount()) &&
                Objects.equals(tx.getType(), candidate.getType()) &&
                Objects.equals(tx.getDescription(), candidate.getDescription()) &&
                Objects.equals(tx.getDate(), candidate.getDate())
        );
    }
}
