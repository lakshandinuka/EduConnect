package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.PolicyRequest;
import com.sfs.educonnect.mapper.KnowledgeBaseMapper;
import com.sfs.educonnect.repository.KbItemRepository;
import com.sfs.educonnect.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class PolicyController {
    private final PolicyService policyService;
    private final KbItemRepository kbItemRepository;

    @GetMapping
    public List<Map<String, Object>> list() {
        return policyService.listPublic();
    }

    @GetMapping("/items/{id:\\d+}")
    public List<Map<String, Object>> policiesForItem(@PathVariable Long id) {
        return kbItemRepository.findById(id)
                .filter(item -> item.getPolicy() != null)
                .map(item -> List.of(KnowledgeBaseMapper.policy(item.getPolicy())))
                .orElse(List.of());
    }

    @GetMapping("/templates")
    public List<Map<String, Object>> templates() {
        return List.of(
                Map.of("id", "PUBLIC", "name", "Public Access", "description", "Available to all authenticated users"),
                Map.of("id", "STAFF_ONLY", "name", "Staff Only", "description", "Available to staff and admins"),
                Map.of("id", "DEPT_ADMIN", "name", "Department Admin", "description", "Available to department administrators")
        );
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> adminList() {
        return Map.of("items", policyService.listPublic());
    }

    @GetMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> adminGet(@PathVariable Long id) {
        return policyService.get(id);
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> create(@RequestBody PolicyRequest request) {
        return policyService.create(request);
    }

    @PutMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody PolicyRequest request) {
        return policyService.update(id, request);
    }

    @DeleteMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> delete(@PathVariable Long id) {
        policyService.delete(id);
        return Map.of("ok", true);
    }
}
