package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.FaqRequest;
import com.sfs.educonnect.entity.Faq;
import com.sfs.educonnect.enums.FaqStatus;
import com.sfs.educonnect.mapper.KnowledgeBaseMapper;
import com.sfs.educonnect.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;

    public List<Map<String, Object>> listPublished() {
        return faqRepository.findByStatusOrderBySortOrderAscUpdatedAtDesc(FaqStatus.PUBLISHED).stream()
                .map(KnowledgeBaseMapper::faq)
                .toList();
    }

    public Map<String, Object> listAdmin() {
        return Map.of("items", faqRepository.findAllByOrderBySortOrderAscUpdatedAtDesc().stream()
                .map(KnowledgeBaseMapper::faq)
                .toList());
    }

    public Map<String, Object> create(FaqRequest request) {
        Faq faq = new Faq();
        apply(faq, request);
        return Map.of("id", faqRepository.save(faq).getId());
    }

    public Map<String, Object> update(Long id, FaqRequest request) {
        Faq faq = find(id);
        apply(faq, request);
        faqRepository.save(faq);
        return Map.of("ok", true);
    }

    public Map<String, Object> reorder(List<Map<String, Object>> items) {
        if (items == null) {
            return Map.of("ok", true);
        }
        for (Map<String, Object> item : items) {
            Long id = numberToLong(item.get("id"));
            Integer sortOrder = numberToInteger(item.getOrDefault("sort_order", item.get("sortOrder")));
            if (id != null && sortOrder != null) {
                Faq faq = find(id);
                faq.setSortOrder(sortOrder);
                faqRepository.save(faq);
            }
        }
        return Map.of("ok", true);
    }

    public void delete(Long id) {
        if (!faqRepository.existsById(id)) {
            throw new IllegalArgumentException("FAQ not found");
        }
        faqRepository.deleteById(id);
    }

    public List<Map<String, Object>> search(String q) {
        String query = q == null ? "" : q.trim();
        if (query.isBlank()) {
            return List.of();
        }
        return faqRepository
                .searchPublished(FaqStatus.PUBLISHED, query, PageRequest.of(0, 5))
                .stream()
                .sorted(Comparator.comparing(Faq::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(KnowledgeBaseMapper::faq)
                .toList();
    }

    private Faq find(Long id) {
        return faqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("FAQ not found"));
    }

    private void apply(Faq faq, FaqRequest request) {
        if (request.getQuestion() == null || request.getQuestion().isBlank()) {
            throw new IllegalArgumentException("Question is required");
        }
        if (request.getAnswer() == null || request.getAnswer().isBlank()) {
            throw new IllegalArgumentException("Answer is required");
        }
        faq.setQuestion(request.getQuestion().trim());
        faq.setAnswer(request.getAnswer());
        faq.setCategory(request.getCategory() == null || request.getCategory().isBlank()
                ? "General"
                : request.getCategory().trim());
        faq.setStatus(request.getStatus() == null ? FaqStatus.PUBLISHED : request.getStatus());
        faq.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    }

    private Long numberToLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String string && !string.isBlank()) {
            return Long.parseLong(string);
        }
        return null;
    }

    private Integer numberToInteger(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String string && !string.isBlank()) {
            return Integer.parseInt(string);
        }
        return null;
    }
}
