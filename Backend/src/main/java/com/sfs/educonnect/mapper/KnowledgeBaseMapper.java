package com.sfs.educonnect.mapper;

import com.sfs.educonnect.entity.Category;
import com.sfs.educonnect.entity.Faq;
import com.sfs.educonnect.entity.KbItem;
import com.sfs.educonnect.entity.Policy;

import java.util.LinkedHashMap;
import java.util.Map;

public final class KnowledgeBaseMapper {
    private KnowledgeBaseMapper() {
    }

    public static Map<String, Object> category(Category category, long itemCount) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", category.getId());
        body.put("name", category.getName());
        body.put("description", category.getDescription());
        body.put("itemCount", itemCount);
        return body;
    }

    public static Map<String, Object> category(Category category) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", category.getId());
        body.put("name", category.getName());
        body.put("description", category.getDescription());
        return body;
    }

    public static Map<String, Object> policy(Policy policy) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", policy.getId());
        body.put("name", policy.getName());
        body.put("description", policy.getDescription());
        body.put("rules", policy.getRules());
        body.put("icon", policy.getIcon());
        return body;
    }

    public static Map<String, Object> faq(Faq faq) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", faq.getId());
        body.put("question", faq.getQuestion());
        body.put("answer", faq.getAnswer());
        body.put("category", faq.getCategory());
        body.put("status", faq.getStatus());
        body.put("sort_order", faq.getSortOrder());
        body.put("sortOrder", faq.getSortOrder());
        body.put("updated_at", faq.getUpdatedAt());
        body.put("updatedAt", faq.getUpdatedAt());
        return body;
    }

    public static Map<String, Object> itemSummary(KbItem item) {
        Map<String, Object> body = itemBase(item);
        return body;
    }

    public static Map<String, Object> itemDetail(KbItem item) {
        Map<String, Object> body = itemBase(item);
        body.put("content", item.getContent());
        body.put("pdfUrl", item.getPdfUrl());
        return body;
    }

    private static Map<String, Object> itemBase(KbItem item) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", item.getId());
        body.put("title", item.getTitle());
        body.put("description", item.getDescription());
        body.put("type", item.getType());
        body.put("status", item.getStatus());
        body.put("createdAt", item.getCreatedAt());
        body.put("updatedAt", item.getUpdatedAt());
        body.put("category", category(item.getCategory()));
        body.put("categories", java.util.List.of(category(item.getCategory())));
        body.put("policyId", item.getPolicy() != null ? item.getPolicy().getId() : null);
        body.put("isFeatured", item.isFeatured());
        body.put("isRecommended", item.isRecommended());
        body.put("recommended", item.isRecommended());
        return body;
    }
}
