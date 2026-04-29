package com.sfs.educonnect.service.impl;

import com.sfs.educonnect.dto.SLAPolicyDTO;
import com.sfs.educonnect.entity.EscalationRule;
import com.sfs.educonnect.entity.SLAPolicy;
import com.sfs.educonnect.exception.ResourceNotFoundException;
import com.sfs.educonnect.mapper.SLAMapper;
import com.sfs.educonnect.repository.SLAPolicyRepository;
import com.sfs.educonnect.service.SLAPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SLAPolicyServiceImpl implements SLAPolicyService {

    private final SLAPolicyRepository slaPolicyRepository;
    private final SLAMapper slaMapper;

    @Override
    @Transactional
    public SLAPolicyDTO createPolicy(SLAPolicyDTO policyDTO) {

        SLAPolicy entity = slaMapper.toEntity(policyDTO);

        // Fix relationship
        if (entity.getEscalationRules() != null) {
            entity.getEscalationRules().forEach(rule -> rule.setSlaPolicy(entity));
        }

        SLAPolicy saved = slaPolicyRepository.save(entity);

        return slaMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SLAPolicyDTO> getAllPolicies() {
        return slaPolicyRepository.findAll()
                .stream()
                .map(slaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SLAPolicyDTO getPolicyById(Long id) {

        SLAPolicy policy = slaPolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SLA Policy not found with id: " + id));

        return slaMapper.toDTO(policy);
    }

    @Override
    @Transactional
    public SLAPolicyDTO updatePolicy(Long id, SLAPolicyDTO policyDTO) {

        SLAPolicy existing = slaPolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SLA Policy not found with id: " + id));

        // Update basic fields
        existing.setName(policyDTO.getName());
        existing.setDepartment(policyDTO.getDepartment());
        existing.setPriority(policyDTO.getPriority());
        existing.setStatus(policyDTO.getStatus());
        existing.setResponseTimeValue(policyDTO.getResponseTimeValue());
        existing.setResponseTimeUnit(policyDTO.getResponseTimeUnit());
        existing.setResolutionTimeValue(policyDTO.getResolutionTimeValue());
        existing.setResolutionTimeUnit(policyDTO.getResolutionTimeUnit());

        // Reset escalation rules
        existing.getEscalationRules().clear();

        if (policyDTO.getEscalationRules() != null) {
            policyDTO.getEscalationRules().forEach(ruleDTO -> {
                EscalationRule rule = slaMapper.toEntity(ruleDTO);
                existing.addEscalationRule(rule);
            });
        }

        SLAPolicy updated = slaPolicyRepository.save(existing);

        return slaMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deletePolicy(Long id) {

        if (!slaPolicyRepository.existsById(id)) {
            throw new ResourceNotFoundException("SLA Policy not found with id: " + id);
        }

        slaPolicyRepository.deleteById(id);
    }

    @Override
    public boolean evaluateTicketEscalation(Long ticketId, Long slaPolicyId) {

        // Placeholder for future ticket integration
        // You can later compare:
        // - ticket createdAt
        // - SLA response/resolution time

        return false;
    }

    @Override
    public void triggerEscalationRules(Long slaPolicyId) {

        // Placeholder for escalation automation
        // Later:
        // - Loop through escalation rules
        // - Send notifications / update tickets
    }
}