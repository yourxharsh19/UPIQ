package com.UPIQ.PDFParserService.controller;

import com.UPIQ.PDFParserService.dto.ApiResponse;
import com.UPIQ.PDFParserService.dto.ParsingResponse;
import com.UPIQ.PDFParserService.service.ParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class ParserController {

        private final ParserService parserService;

        /**
         * Upload and parse a transaction file (PDF or CSV)
         * 
         * @param file The transaction file to parse (PDF or CSV)
         * @return ApiResponse containing parsed transactions and statistics
         */
        @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<ParsingResponse>> uploadAndParse(
                        @RequestParam("file") MultipartFile file) {
                log.info("Received file upload request: {} ({} bytes)",
                                file.getOriginalFilename(), file.getSize());

                ParsingResponse response = parserService.parseFile(file);

                ApiResponse<ParsingResponse> apiResponse = ApiResponse.<ParsingResponse>builder()
                                .success(true)
                                .data(response)
                                .message("File parsed successfully")
                                .build();

                return ResponseEntity.ok(apiResponse);
        }

        /**
         * Health check endpoint
         */
        @GetMapping("/health")
        public ResponseEntity<ApiResponse<String>> health() {
                ApiResponse<String> response = ApiResponse.<String>builder()
                                .success(true)
                                .data("UPIQ-PDFParser-Service is running")
                                .message("Service is healthy")
                                .build();
                return ResponseEntity.ok(response);
        }
}
