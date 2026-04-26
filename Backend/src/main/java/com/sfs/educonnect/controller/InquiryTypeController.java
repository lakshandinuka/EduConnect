package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.InquiryType;
import com.sfs.educonnect.service.InquiryTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inquiry-types")
@RequiredArgsConstructor
public class InquiryTypeController {
    private final InquiryTypeService inquiryTypeService;

    @GetMapping
    public ResponseEntity<List<InquiryType>> getAllInquiryTypes() {
        return ResponseEntity.ok(inquiryTypeService.getAllInquiryTypes());
    }
}
