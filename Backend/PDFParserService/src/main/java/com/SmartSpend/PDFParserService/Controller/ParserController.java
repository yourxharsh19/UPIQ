package com.SmartSpend.PDFParserService.Controller;

import com.SmartSpend.PDFParserService.DTO.ParsingResponse;
import com.SmartSpend.PDFParserService.Service.ParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/parser")
@RequiredArgsConstructor
public class ParserController {

    private final ParserService parserService;

    /**
     * Upload and parse a transaction file (PDF or CSV)
     * 
     * @param file The transaction file to parse (PDF or CSV)
     * @return ParsingResponse containing parsed transactions and statistics
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ParsingResponse> uploadAndParse(
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Received file upload request: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
        
        ParsingResponse response = parserService.parseFile(file);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("PDF Parser Service is running");
    }
}
