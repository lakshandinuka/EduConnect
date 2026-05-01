package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.CategoryRequest;
import com.sfs.educonnect.service.KbCategoryService;
import com.sfs.educonnect.service.KnowledgeBaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class KbCategoryController {
    private final KbCategoryService kbCategoryService;
    private final KnowledgeBaseService knowledgeBaseService;

    @GetMapping
    public List<Map<String, Object>> list() {
        return kbCategoryService.listPublic();
    }

    @GetMapping("/{id:\\d+}")
    public Map<String, Object> get(@PathVariable Long id) {
        return kbCategoryService.getPublic(id);
    }

    @GetMapping("/{id:\\d+}/items")
    public Map<String, Object> items(@PathVariable Long id) {
        return knowledgeBaseService.listCategoryItems(id);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<Map<String, Object>> adminList() {
        return kbCategoryService.listAdmin();
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> create(@RequestBody CategoryRequest request) {
        return kbCategoryService.create(request);
    }

    @PutMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return kbCategoryService.update(id, request);
    }

    @DeleteMapping("/admin/{id:\\d+}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> delete(@PathVariable Long id) {
        kbCategoryService.delete(id);
        return Map.of("ok", true);
    }
}
