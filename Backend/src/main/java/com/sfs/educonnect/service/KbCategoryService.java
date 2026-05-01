package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.CategoryRequest;
import com.sfs.educonnect.entity.Category;
import com.sfs.educonnect.enums.KbItemStatus;
import com.sfs.educonnect.mapper.KnowledgeBaseMapper;
import com.sfs.educonnect.repository.CategoryRepository;
import com.sfs.educonnect.repository.KbItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KbCategoryService {
    private final CategoryRepository categoryRepository;
    private final KbItemRepository kbItemRepository;

    public List<Map<String, Object>> listPublic() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(category -> KnowledgeBaseMapper.category(
                        category,
                        kbItemRepository.countByCategoryIdAndStatus(category.getId(), KbItemStatus.PUBLISHED)
                ))
                .toList();
    }

    public Map<String, Object> getPublic(Long id) {
        Category category = find(id);
        return KnowledgeBaseMapper.category(
                category,
                kbItemRepository.countByCategoryIdAndStatus(category.getId(), KbItemStatus.PUBLISHED)
        );
    }

    public List<Map<String, Object>> listAdmin() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(KnowledgeBaseMapper::category)
                .toList();
    }

    public Map<String, Object> create(CategoryRequest request) {
        Category category = new Category();
        apply(category, request);
        return Map.of("id", categoryRepository.save(category).getId());
    }

    public Map<String, Object> update(Long id, CategoryRequest request) {
        Category category = find(id);
        apply(category, request);
        categoryRepository.save(category);
        return Map.of("ok", true);
    }

    public void delete(Long id) {
        if (kbItemRepository.existsByCategoryId(id)) {
            throw new IllegalStateException("Category is in use by knowledge base items");
        }
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private Category find(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    private void apply(Category category, CategoryRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription() == null ? "" : request.getDescription());
    }
}
