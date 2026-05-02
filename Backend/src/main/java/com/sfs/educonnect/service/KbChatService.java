package com.sfs.educonnect.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sfs.educonnect.dto.ChatMessageRequest;
import com.sfs.educonnect.entity.PageContent;
import com.sfs.educonnect.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class KbChatService {
    private static final Pattern SOURCE_PATTERN = Pattern.compile("\\[(KB|FAQ|PAGE)-(\\d+)]");
    private static final String FALLBACK_RESPONSE = "Sorry, I can't help you with that. Please refer the knowledgebase for more information.";

    private final KnowledgeBaseService knowledgeBaseService;
    private final FaqService faqService;
    private final PageContentRepository pageContentRepository;
    private final Environment environment;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.api-key:}")
    private String configuredApiKey;

    public Map<String, Object> message(ChatMessageRequest request) throws Exception {
        String text = request.getMessage() == null ? "" : request.getMessage().trim();
        if (text.isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        List<Map<String, Object>> kbItems = knowledgeBaseService.searchForChat(text);
        List<Map<String, Object>> faqs = faqService.search(text);
        List<Map<String, Object>> pages = searchPages(text);
        String context = buildContext(kbItems, faqs, pages);

        if (kbItems.isEmpty() && faqs.isEmpty() && pages.isEmpty()) {
            return response(FALLBACK_RESPONSE, List.of());
        }

        String apiKey = resolveApiKey();
        if (apiKey.isBlank()) {
            return response(FALLBACK_RESPONSE, List.of());
        }

        String prompt = """
                You are a helpful student support chatbot. Answer the student's question using only the knowledge base context below.
                If the answer is not in the context, answer exactly: %s
                Include source references in brackets like [KB-1], [FAQ-2], or [PAGE-3] when you use a source.
                Keep the answer concise and student-friendly.

                %s

                Question: %s
                """.formatted(FALLBACK_RESPONSE, context, text);

        String generated;
        try {
            generated = callGemini(apiKey, prompt);
        } catch (Exception e) {
            return response(FALLBACK_RESPONSE, List.of());
        }
        List<Map<String, Object>> sources = extractSources(generated, kbItems, faqs, pages);
        String cleaned = SOURCE_PATTERN.matcher(generated).replaceAll("").trim();
        if (cleaned.isBlank() || isFallbackAnswer(cleaned)) {
            return response(FALLBACK_RESPONSE, List.of());
        }
        return response(cleaned, sources);
    }

    private String resolveApiKey() {
        String[] candidates = {
                environment.getProperty("GEMINI_API_KEY"),
                configuredApiKey,
                environment.getProperty("gemini.api-key")
        };
        for (String candidate : candidates) {
            String normalized = normalizeSecret(candidate);
            if (!normalized.isBlank()) {
                return normalized;
            }
        }
        return "";
    }

    private String normalizeSecret(String value) {
        if (value == null) {
            return "";
        }
        String trimmed = value.trim();
        if (trimmed.contains("${")) {
            return "";
        }
        if ((trimmed.startsWith("\"") && trimmed.endsWith("\""))
                || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
        }
        return trimmed;
    }

    private boolean isFallbackAnswer(String answer) {
        String lower = answer.toLowerCase();
        return lower.contains("do not have that information")
                || lower.contains("don't have that information")
                || lower.contains("not in the context")
                || lower.contains("cannot answer")
                || lower.contains("can't answer");
    }

    private String callGemini(String apiKey, String prompt) throws Exception {
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                ))
        );
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/"
                + URLEncoder.encode(model, StandardCharsets.UTF_8)
                + ":generateContent?key="
                + URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new IllegalStateException("Gemini request failed");
        }
        JsonNode root = objectMapper.readTree(response.body());
        JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
        return textNode.isMissingNode() ? "" : textNode.asText();
    }

    private String buildContext(List<Map<String, Object>> kbItems, List<Map<String, Object>> faqs, List<Map<String, Object>> pages) {
        StringBuilder context = new StringBuilder("KNOWLEDGE BASE CONTEXT:\n\n");
        if (!kbItems.isEmpty()) {
            context.append("KB ARTICLES:\n");
            for (Map<String, Object> item : kbItems) {
                context.append("[KB-").append(item.get("id")).append("] ")
                        .append(item.get("title")).append("\n");
                appendSnippet(context, "Description", item.get("description"));
                appendSnippet(context, "Content", item.get("content"));
                context.append("\n");
            }
        }
        if (!faqs.isEmpty()) {
            context.append("FREQUENTLY ASKED QUESTIONS:\n");
            for (Map<String, Object> faq : faqs) {
                context.append("[FAQ-").append(faq.get("id")).append("] Q: ")
                        .append(faq.get("question")).append("\n");
                appendSnippet(context, "A", faq.get("answer"));
                context.append("\n");
            }
        }
        if (!pages.isEmpty()) {
            context.append("PAGES:\n");
            for (Map<String, Object> page : pages) {
                context.append("[PAGE-").append(page.get("id")).append("] ")
                        .append(page.get("title")).append("\n");
                appendSnippet(context, "Content", page.get("content"));
                context.append("\n");
            }
        }
        return context.toString();
    }

    private void appendSnippet(StringBuilder builder, String label, Object value) {
        if (value == null) {
            return;
        }
        String text = value.toString();
        if (text.isBlank()) {
            return;
        }
        builder.append(label).append(": ")
                .append(text, 0, Math.min(text.length(), 600))
                .append("\n");
    }

    private List<Map<String, Object>> searchPages(String q) {
        String lower = q.toLowerCase();
        return pageContentRepository.findAll().stream()
                .filter(page -> page.getContentJson() != null && page.getContentJson().toLowerCase().contains(lower))
                .limit(3)
                .map(this::pageSource)
                .toList();
    }

    private Map<String, Object> pageSource(PageContent page) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", page.getId());
        body.put("title", page.getPageKey());
        body.put("content", page.getContentJson());
        return body;
    }

    private List<Map<String, Object>> extractSources(
            String generated,
            List<Map<String, Object>> kbItems,
            List<Map<String, Object>> faqs,
            List<Map<String, Object>> pages
    ) {
        List<Map<String, Object>> sources = new ArrayList<>();
        Matcher matcher = SOURCE_PATTERN.matcher(generated == null ? "" : generated);
        while (matcher.find()) {
            String type = matcher.group(1);
            Long id = Long.parseLong(matcher.group(2));
            Map<String, Object> source = switch (type) {
                case "KB" -> findSource(kbItems, id, "KB Article", "title");
                case "FAQ" -> findSource(faqs, id, "FAQ", "question");
                case "PAGE" -> findSource(pages, id, "Page", "title");
                default -> null;
            };
            if (source != null && sources.stream().noneMatch(existing -> existing.get("type").equals(source.get("type")) && existing.get("id").equals(source.get("id")))) {
                source.put("url", sourceUrl(type, id, source));
                sources.add(source);
            }
        }
        return sources;
    }

    private String sourceUrl(String sourceType, Long id, Map<String, Object> source) {
        return switch (sourceType) {
            case "KB" -> "/kb/item/" + id;
            case "FAQ" -> "/kb/faq?faqId=" + id;
            case "PAGE" -> pageUrl(source.get("title"));
            default -> "/kb";
        };
    }

    private String pageUrl(Object pageKey) {
        if (pageKey == null) {
            return "/kb";
        }
        String key = pageKey.toString().trim().toLowerCase();
        return switch (key) {
            case "home" -> "/home";
            case "about" -> "/home#about";
            default -> "/kb";
        };
    }

    private Map<String, Object> findSource(List<Map<String, Object>> candidates, Long id, String type, String titleKey) {
        return candidates.stream()
                .filter(item -> id.equals(((Number) item.get("id")).longValue()))
                .findFirst()
                .map(item -> {
                    Map<String, Object> source = new LinkedHashMap<>();
                    source.put("type", type);
                    source.put("id", id);
                    source.put("title", item.get(titleKey));
                    Object category = item.get("category");
                    if (category instanceof Map<?, ?> map) {
                        source.put("category", map.get("name"));
                    }
                    return source;
                })
                .orElse(null);
    }

    private Map<String, Object> response(String text, List<Map<String, Object>> sources) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", Instant.now().toEpochMilli());
        body.put("response", text);
        body.put("sources", sources);
        body.put("timestamp", Instant.now().toString());
        return body;
    }
}
