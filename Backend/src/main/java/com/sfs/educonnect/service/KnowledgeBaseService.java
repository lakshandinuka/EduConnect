package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.KbItemRequest;
import com.sfs.educonnect.entity.Category;
import com.sfs.educonnect.entity.KbItem;
import com.sfs.educonnect.entity.Policy;
import com.sfs.educonnect.enums.KbItemStatus;
import com.sfs.educonnect.enums.KbItemType;
import com.sfs.educonnect.mapper.KnowledgeBaseMapper;
import com.sfs.educonnect.repository.CategoryRepository;
import com.sfs.educonnect.repository.KbItemRepository;
import com.sfs.educonnect.repository.PolicyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KnowledgeBaseService {
    private static final Set<String> CHAT_STOP_WORDS = Set.of(
            "a", "an", "and", "are", "can", "do", "for", "how", "i", "in", "is", "it",
            "me", "my", "of", "on", "or", "please", "the", "that", "to", "what", "where"
    );

    private final KbItemRepository kbItemRepository;
    private final CategoryRepository categoryRepository;
    private final PolicyRepository policyRepository;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public Map<String, Object> home() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("recommended", mapItems(kbItemRepository.findTop6ByStatusAndRecommendedTrueOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED)));
        body.put("trending", mapItems(kbItemRepository.findTop6ByStatusOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED)));
        body.put("featured", mapItems(kbItemRepository.findTop6ByStatusAndFeaturedTrueOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED)));
        return body;
    }

    public Map<String, Object> recommended() {
        return Map.of("items", mapItems(kbItemRepository.findTop12ByStatusAndRecommendedTrueOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED)));
    }

    public Map<String, Object> trending() {
        return Map.of("items", mapItems(kbItemRepository.findTop12ByStatusOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED)));
    }

    public Map<String, Object> featured() {
        return Map.of("items", mapItems(kbItemRepository.findTop12ByStatusAndFeaturedTrueOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED)));
    }

    public Map<String, Object> listPublished(String q, Long categoryId, KbItemType type) {
        List<KbItem> items = kbItemRepository.findAll(
                spec(KbItemStatus.PUBLISHED, type, categoryId, q),
                PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "updatedAt"))
        ).getContent();
        return Map.of("items", mapItems(items), "total", items.size());
    }

    public Map<String, Object> listCategoryItems(Long categoryId) {
        List<KbItem> items = kbItemRepository.findTop200ByStatusAndCategoryIdOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED, categoryId);
        return Map.of("items", mapItems(items), "total", items.size());
    }

    public Map<String, Object> getItem(Long id, boolean canSeeDrafts) {
        KbItem item = find(id);
        if (item.getStatus() != KbItemStatus.PUBLISHED && !canSeeDrafts) {
            throw new IllegalArgumentException("Not found");
        }
        return KnowledgeBaseMapper.itemDetail(item);
    }

    public Map<String, Object> related(Long id, int limit) {
        KbItem item = find(id);
        int safeLimit = Math.max(1, Math.min(limit, 20));
        List<KbItem> related = kbItemRepository
                .findTop20ByStatusAndCategoryIdAndIdNotOrderByUpdatedAtDesc(
                        KbItemStatus.PUBLISHED,
                        item.getCategory().getId(),
                        id
                )
                .stream()
                .limit(safeLimit)
                .toList();
        return Map.of("items", mapItems(related));
    }

    public Map<String, Object> feedback(Long id) {
        if (!kbItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Not found");
        }
        return Map.of("ok", true);
    }

    public Map<String, Object> listAdmin(KbItemStatus status, KbItemType type, Long categoryId) {
        List<KbItem> items = kbItemRepository.findAll(
                spec(status, type, categoryId, null),
                PageRequest.of(0, 500, Sort.by(Sort.Direction.DESC, "updatedAt"))
        ).getContent();
        return Map.of("items", mapItems(items), "total", items.size());
    }

    public Map<String, Object> create(KbItemRequest request) {
        KbItem item = new KbItem();
        apply(item, request, true);
        return Map.of("id", kbItemRepository.save(item).getId());
    }

    public Map<String, Object> update(Long id, KbItemRequest request) {
        KbItem item = find(id);
        apply(item, request, false);
        kbItemRepository.save(item);
        return Map.of("ok", true);
    }

    public Map<String, Object> setStatus(Long id, KbItemStatus status) {
        KbItem item = find(id);
        item.setStatus(status);
        kbItemRepository.save(item);
        return Map.of("ok", true);
    }

    public void delete(Long id) {
        if (!kbItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Item not found");
        }
        kbItemRepository.deleteById(id);
    }

    public Map<String, Object> uploadPdf(MultipartFile file, String publicBaseUrl) throws IOException {
        validatePdf(file);
        Path uploadPath = pdfUploadPath();
        Files.createDirectories(uploadPath);

        String original = file.getOriginalFilename() == null ? "document.pdf" : Paths.get(file.getOriginalFilename()).getFileName().toString();
        String safeBase = original
                .replaceAll("(?i)\\.pdf$", "")
                .replaceAll("[^a-zA-Z0-9_-]+", "-")
                .replaceAll("^-+|-+$", "");
        if (safeBase.isBlank()) {
            safeBase = "document";
        }
        if (safeBase.length() > 80) {
            safeBase = safeBase.substring(0, 80);
        }

        String fileName = System.currentTimeMillis() + "-" + UUID.randomUUID() + "-" + safeBase + ".pdf";
        file.transferTo(uploadPath.resolve(fileName));

        String base = publicBaseUrl == null ? "" : publicBaseUrl.replaceAll("/$", "");
        return Map.of(
                "url", base + "/api/kb/files/" + fileName,
                "fileName", original,
                "size", file.getSize()
        );
    }

    public ResponseEntity<?> download(Long id) throws IOException {
        KbItem item = find(id);
        if (item.getType() != KbItemType.PDF || item.getPdfUrl() == null || item.getPdfUrl().isBlank()) {
            throw new IllegalArgumentException("PDF not found");
        }
        String fileName = extractStoredFileName(item.getPdfUrl());
        if (fileName != null) {
            return servePdf(fileName, true, item.getTitle() + ".pdf");
        }
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(item.getPdfUrl())).build();
    }

    public ResponseEntity<Resource> servePdf(String fileName, boolean attachment, String downloadName) throws IOException {
        if (fileName.contains("/") || fileName.contains("\\") || !fileName.toLowerCase(Locale.ROOT).endsWith(".pdf")) {
            return ResponseEntity.notFound().build();
        }
        Path path = pdfUploadPath().resolve(fileName).normalize();
        Path root = pdfUploadPath().toAbsolutePath().normalize();
        if (!path.toAbsolutePath().normalize().startsWith(root) || !Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(path.toUri());
        String responseName = downloadName == null || downloadName.isBlank() ? fileName : downloadName;
        ContentDisposition disposition = attachment
                ? ContentDisposition.attachment().filename(responseName).build()
                : ContentDisposition.inline().filename(responseName).build();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    public List<Map<String, Object>> searchForChat(String q) {
        String query = q == null ? "" : q.trim();
        if (query.isBlank()) {
            return List.of();
        }
        LinkedHashMap<Long, KbItem> matches = new LinkedHashMap<>();
        kbItemRepository.searchPublished(KbItemStatus.PUBLISHED, query, PageRequest.of(0, 5))
                .forEach(item -> matches.put(item.getId(), item));

        List<String> terms = tokenizeForChat(query);
        if (matches.size() < 5 && !terms.isEmpty()) {
            kbItemRepository.findTop200ByStatusOrderByUpdatedAtDesc(KbItemStatus.PUBLISHED).stream()
                    .map(item -> Map.entry(item, chatScore(item, terms)))
                    .filter(entry -> entry.getValue() > 0)
                    .sorted(Map.Entry.<KbItem, Integer>comparingByValue(Comparator.reverseOrder()))
                    .forEach(entry -> {
                        if (matches.size() < 5) {
                            matches.putIfAbsent(entry.getKey().getId(), entry.getKey());
                        }
                    });
        }

        return matches.values().stream()
                .limit(5)
                .map(KnowledgeBaseMapper::itemDetail)
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

    private int chatScore(KbItem item, List<String> terms) {
        String title = searchable(item.getTitle());
        String description = searchable(item.getDescription());
        String content = searchable(item.getContent());
        String category = item.getCategory() == null ? "" : searchable(item.getCategory().getName());

        int score = 0;
        for (String term : terms) {
            if (title.contains(term)) {
                score += 6;
            }
            if (description.contains(term)) {
                score += 4;
            }
            if (category.contains(term)) {
                score += 3;
            }
            if (content.contains(term)) {
                score += 1;
            }
        }
        return score;
    }

    private String searchable(String value) {
        if (value == null) {
            return "";
        }
        return value.replaceAll("<[^>]+>", " ")
                .toLowerCase(Locale.ROOT);
    }

    private List<Map<String, Object>> mapItems(List<KbItem> items) {
        return items.stream().map(KnowledgeBaseMapper::itemSummary).toList();
    }

    private KbItem find(Long id) {
        return kbItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Not found"));
    }

    private void apply(KbItem item, KbItemRequest request, boolean creating) {
        if (request.getTitle() != null) {
            if (request.getTitle().isBlank()) {
                throw new IllegalArgumentException("Title is required");
            }
            item.setTitle(request.getTitle().trim());
        } else if (creating) {
            throw new IllegalArgumentException("Title is required");
        }

        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        } else if (creating) {
            item.setDescription("");
        }
        if (request.getType() != null) {
            item.setType(request.getType());
        }
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            item.setCategory(category);
        } else if (creating) {
            throw new IllegalArgumentException("Category is required");
        }
        if (request.getPolicyId() != null) {
            Policy policy = policyRepository.findById(request.getPolicyId())
                    .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
            item.setPolicy(policy);
        } else if (creating) {
            item.setPolicy(null);
        }
        if (request.getContent() != null) {
            item.setContent(request.getContent());
        } else if (creating) {
            item.setContent("");
        }
        if (request.getPdfUrl() != null) {
            item.setPdfUrl(request.getPdfUrl());
        } else if (creating) {
            item.setPdfUrl("");
        }
        if (request.getIsFeatured() != null) {
            item.setFeatured(request.getIsFeatured());
        }
        if (request.getIsRecommended() != null) {
            item.setRecommended(request.getIsRecommended());
        }
    }

    private Specification<KbItem> spec(KbItemStatus status, KbItemType type, Long categoryId, String q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("content")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void validatePdf(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file is required");
        }
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String contentType = file.getContentType() == null ? "" : file.getContentType();
        if (!name.toLowerCase(Locale.ROOT).endsWith(".pdf") || !"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException("Only PDF files are supported");
        }
        byte[] signature = new byte[5];
        try (InputStream inputStream = file.getInputStream()) {
            int read = inputStream.read(signature);
            if (read < 5 || !"%PDF-".equals(new String(signature))) {
                throw new IllegalArgumentException("Only PDF files are supported");
            }
        }
    }

    private Path pdfUploadPath() {
        return Paths.get(uploadDir).resolve("kb-pdfs");
    }

    private String extractStoredFileName(String pdfUrl) {
        String marker = "/api/kb/files/";
        int index = pdfUrl.indexOf(marker);
        if (index < 0) {
            return null;
        }
        return pdfUrl.substring(index + marker.length());
    }
}
