package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.DuplicateRequestDTO;
import com.sfs.educonnect.dto.DuplicateResponseDTO;
import com.sfs.educonnect.dto.SaveResponseRequestDTO;
import com.sfs.educonnect.dto.SaveResponseResponseDTO;
import com.sfs.educonnect.service.DuplicateDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")   // allow frontend to call (adjust as needed)
public class DuplicateDetectionController {

    private final DuplicateDetectionService duplicateDetectionService;

    @PostMapping("/detect-duplicates")
    public ResponseEntity<DuplicateResponseDTO> detectDuplicates(@RequestBody DuplicateRequestDTO request) {
        DuplicateResponseDTO result = duplicateDetectionService.findDuplicates(request.getTicketText());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/save-response")
    public ResponseEntity<SaveResponseResponseDTO> saveResponse(@RequestBody SaveResponseRequestDTO request) {
        SaveResponseResponseDTO result = duplicateDetectionService.saveResponse(request);
        return ResponseEntity.ok(result);
    }
}