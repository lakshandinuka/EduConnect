package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.KbItemRequest;
import com.sfs.educonnect.enums.KbItemStatus;
import com.sfs.educonnect.enums.KbItemType;
import com.sfs.educonnect.service.KnowledgeBaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/kb")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class KnowledgeBaseController {
    private final KnowledgeBaseService knowledgeBaseService;

    @GetMapping
    public Map<String, Object> home() {
        return knowledgeBaseService.home();
    }

    @GetMapping("/items/recommended")
    public Map<String, Object> recommended() {
        return knowledgeBaseService.recommended();
    }

    @GetMapping("/items/trending")
    public Map<String, Object> trending() {
        return knowledgeBaseService.trending();
    }

    @GetMapping("/items/featured")
    public Map<String, Object> featured() {
        return knowledgeBaseService.featured();
    }

    @GetMapping("/items")
    public Map<String, Object> items(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) KbItemType type
    ) {
        return knowledgeBaseService.listPublished(
                q != null ? q : search,
                categoryId != null ? categoryId : category,
                type
        );
    }

    @GetMapping("/items/{id:\\d+}")
    public Map<String, Object> item(@PathVariable Long id) {
        return knowledgeBaseService.getItem(id, isSuperAdmin());
    }

    @GetMapping("/items/{id:\\d+}/related")
    public Map<String, Object> related(@PathVariable Long id, @RequestParam(defaultValue = "5") int limit) {
        return knowledgeBaseService.related(id, limit);
    }

    @PostMapping("/items/{id:\\d+}/feedback")
    public Map<String, Object> feedback(@PathVariable Long id) {
        return knowledgeBaseService.feedback(id);
    }

    @GetMapping("/items/{id:\\d+}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> download(@PathVariable Long id) throws IOException {
        return knowledgeBaseService.download(id);
    }

    @GetMapping("/files/{fileName:.+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> file(@PathVariable String fileName) throws IOException {
        return knowledgeBaseService.servePdf(fileName, false, fileName);
    }

    @GetMapping("/admin/items")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> adminItems(
            @RequestParam(required = false) KbItemStatus status,
            @RequestParam(required = false) KbItemType type,
            @RequestParam(required = false) Long category
    ) {
        return knowledgeBaseService.listAdmin(status, type, category);
    }

    @PostMapping("/admin/upload-pdf")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> uploadPdf(@RequestParam("file") MultipartFile file) throws IOException {
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        return knowledgeBaseService.uploadPdf(file, baseUrl);
    }

    @PostMapping("/admin/items")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> create(@RequestBody KbItemRequest request) {
        return knowledgeBaseService.create(request);
    }

    @PutMapping("/admin/items/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody KbItemRequest request) {
        return knowledgeBaseService.update(id, request);
    }

    @PatchMapping("/admin/items/{id:\\d+}/archive")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> archive(@PathVariable Long id) {
        return knowledgeBaseService.setStatus(id, KbItemStatus.ARCHIVED);
    }

    @PatchMapping("/admin/items/{id:\\d+}/unarchive")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> unarchive(@PathVariable Long id) {
        return knowledgeBaseService.setStatus(id, KbItemStatus.PUBLISHED);
    }

    @PatchMapping("/admin/items/{id:\\d+}/publish")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> publish(@PathVariable Long id) {
        return knowledgeBaseService.setStatus(id, KbItemStatus.PUBLISHED);
    }

    @PatchMapping("/admin/items/{id:\\d+}/unpublish")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> unpublish(@PathVariable Long id) {
        return knowledgeBaseService.setStatus(id, KbItemStatus.DRAFT);
    }

    @DeleteMapping("/admin/items/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> delete(@PathVariable Long id) {
        knowledgeBaseService.delete(id);
        return Map.of("ok", true);
    }

    private boolean isSuperAdmin() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_SUPER_ADMIN".equals(authority.getAuthority()));
    }
}
