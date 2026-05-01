package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.PageContentRequest;
import com.sfs.educonnect.entity.PageContent;
import com.sfs.educonnect.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PageContentService {
    private final PageContentRepository pageContentRepository;

    public Map<String, Object> get(String key) {
        return pageContentRepository.findByPageKey(key)
                .map(page -> {
                    Map<String, Object> body = new LinkedHashMap<>();
                    body.put("pageKey", page.getPageKey());
                    body.put("contentJson", page.getContentJson());
                    body.put("updatedAt", page.getUpdatedAt());
                    return body;
                })
                .orElse(null);
    }

    public Map<String, Object> upsert(String key, PageContentRequest request) {
        if (request.getContentJson() == null || request.getContentJson().length() < 2) {
            throw new IllegalArgumentException("contentJson is required");
        }
        PageContent page = pageContentRepository.findByPageKey(key).orElseGet(PageContent::new);
        page.setPageKey(key);
        page.setContentJson(request.getContentJson());
        pageContentRepository.save(page);
        return Map.of("ok", true);
    }
}
