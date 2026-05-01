package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.FaqRequest;
import com.sfs.educonnect.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class FaqController {
    private final FaqService faqService;

    @GetMapping
    public List<Map<String, Object>> list() {
        return faqService.listPublished();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> adminList() {
        return faqService.listAdmin();
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> create(@RequestBody FaqRequest request) {
        return faqService.create(request);
    }

    @PutMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody FaqRequest request) {
        return faqService.update(id, request);
    }

    @PostMapping("/admin/reorder")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @SuppressWarnings("unchecked")
    public Map<String, Object> reorder(@RequestBody Map<String, Object> request) {
        return faqService.reorder((List<Map<String, Object>>) request.get("items"));
    }

    @DeleteMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> delete(@PathVariable Long id) {
        faqService.delete(id);
        return Map.of("ok", true);
    }
}
