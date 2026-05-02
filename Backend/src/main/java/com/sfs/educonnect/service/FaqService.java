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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FaqService {
    private static final Set<String> CHAT_STOP_WORDS = Set.of(
            "a", "an", "and", "are", "can", "do", "for", "how", "i", "in", "is", "it",
            "me", "my", "of", "on", "or", "please", "the", "that", "to", "what", "where"
    );

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
        LinkedHashMap<Long, Faq> matches = new LinkedHashMap<>();
        faqRepository.searchPublished(FaqStatus.PUBLISHED, query, PageRequest.of(0, 5)).stream()
                .sorted(Comparator.comparing(Faq::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .forEach(faq -> matches.put(faq.getId(), faq));

        List<String> terms = tokenizeForChat(query);
        if (matches.size() < 5 && !terms.isEmpty()) {
            faqRepository.findByStatusOrderBySortOrderAscUpdatedAtDesc(FaqStatus.PUBLISHED).stream()
                    .map(faq -> Map.entry(faq, chatScore(faq, terms)))
                    .filter(entry -> entry.getValue() > 0)
                    .sorted(Map.Entry.<Faq, Integer>comparingByValue(Comparator.reverseOrder()))
                    .forEach(entry -> {
                        if (matches.size() < 5) {
                            matches.putIfAbsent(entry.getKey().getId(), entry.getKey());
                        }
                    });
        }

        return matches.values().stream()
                .limit(5)
                .map(KnowledgeBaseMapper::faq)
                .toList();
    }

    private List<String> tokenizeForChat(String query) {
        return List.of(query.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim().split("\\s+"))
                .stream()
                .filter(term -> term.length() > 2)
                .filter(term -> !CHAT_STOP_WORDS.contains(term))
                .distinct()
                .toList();
    }

    private int chatScore(Faq faq, List<String> terms) {
        String question = searchable(faq.getQuestion());
        String answer = searchable(faq.getAnswer());
        String category = searchable(faq.getCategory());

        int score = 0;
        for (String term : terms) {
            if (question.contains(term)) {
                score += 6;
            }
            if (category.contains(term)) {
                score += 3;
            }
            if (answer.contains(term)) {
                score += 1;
            }
        }
        return score;
    }

    private String searchable(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
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
