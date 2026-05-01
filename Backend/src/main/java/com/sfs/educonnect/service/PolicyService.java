package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.PolicyRequest;
import com.sfs.educonnect.entity.Policy;
import com.sfs.educonnect.mapper.KnowledgeBaseMapper;
import com.sfs.educonnect.repository.KbItemRepository;
import com.sfs.educonnect.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PolicyService {
    private final PolicyRepository policyRepository;
    private final KbItemRepository kbItemRepository;

    public List<Map<String, Object>> listPublic() {
        return policyRepository.findAllByOrderByNameAsc().stream()
                .map(KnowledgeBaseMapper::policy)
                .toList();
    }

    public Map<String, Object> get(Long id) {
        return KnowledgeBaseMapper.policy(find(id));
    }

    public Map<String, Object> create(PolicyRequest request) {
        Policy policy = new Policy();
        apply(policy, request);
        return Map.of("id", policyRepository.save(policy).getId());
    }

    public Map<String, Object> update(Long id, PolicyRequest request) {
        Policy policy = find(id);
        apply(policy, request);
        policyRepository.save(policy);
        return Map.of("ok", true);
    }

    public void delete(Long id) {
        if (kbItemRepository.existsByPolicyId(id)) {
            throw new IllegalStateException("Policy is in use by knowledge base items");
        }
        if (!policyRepository.existsById(id)) {
            throw new IllegalArgumentException("Policy not found");
        }
        policyRepository.deleteById(id);
    }

    private Policy find(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
    }

    private void apply(Policy policy, PolicyRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Policy name is required");
        }
        policy.setName(request.getName().trim());
        policy.setDescription(request.getDescription() == null ? "" : request.getDescription());
        policy.setRules(request.getRules() == null ? "" : request.getRules());
        policy.setIcon(request.getIcon() == null ? "" : request.getIcon());
    }
}
