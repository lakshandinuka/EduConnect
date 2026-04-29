package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.SLAPolicyDTO;
import com.sfs.educonnect.service.SLAPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sla")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class SLAPolicyController {

    private final SLAPolicyService slaPolicyService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SLAPolicyDTO> createPolicy(@RequestBody SLAPolicyDTO policyDTO) {
        SLAPolicyDTO created = slaPolicyService.createPolicy(policyDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SLAPolicyDTO>> getAllPolicies() {
        return ResponseEntity.ok(slaPolicyService.getAllPolicies());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SLAPolicyDTO> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(slaPolicyService.getPolicyById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SLAPolicyDTO> updatePolicy(
            @PathVariable Long id,
            @RequestBody SLAPolicyDTO policyDTO
    ) {
        return ResponseEntity.ok(slaPolicyService.updatePolicy(id, policyDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        slaPolicyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/evaluate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> evaluateEscalations(
            @RequestParam Long ticketId,
            @RequestParam Long slaPolicyId
    ) {
        boolean result = slaPolicyService.evaluateTicketEscalation(ticketId, slaPolicyId);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Evaluation simulated successfully.",
                        "requiresEscalation", String.valueOf(result)
                )
        );
    }

    @PostMapping("/escalate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> triggerEscalation(
            @RequestParam Long slaPolicyId
    ) {
        slaPolicyService.triggerEscalationRules(slaPolicyId);

        return ResponseEntity.ok(
                Map.of("message", "Escalation sequence triggered successfully for SLA policy: " + slaPolicyId)
        );
    }
}