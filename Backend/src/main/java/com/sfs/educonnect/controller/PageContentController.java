package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.PageContentRequest;
import com.sfs.educonnect.service.PageContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pages")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class PageContentController {
    private final PageContentService pageContentService;

    @GetMapping("/{key}")
    public Map<String, Object> get(@PathVariable String key) {
        return pageContentService.get(key);
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> update(@PathVariable String key, @RequestBody PageContentRequest request) {
        return pageContentService.upsert(key, request);
    }
}
