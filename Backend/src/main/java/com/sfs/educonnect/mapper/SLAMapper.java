package com.sfs.educonnect.mapper;

import com.sfs.educonnect.dto.EscalationRuleDTO;
import com.sfs.educonnect.dto.SLAPolicyDTO;
import com.sfs.educonnect.entity.EscalationRule;
import com.sfs.educonnect.entity.SLAPolicy;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SLAMapper {

    public SLAPolicyDTO toDTO(SLAPolicy entity) {
        if (entity == null) return null;

        SLAPolicyDTO dto = new SLAPolicyDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDepartment(entity.getDepartment());
        dto.setPriority(entity.getPriority());
        dto.setStatus(entity.getStatus());
        dto.setResponseTimeValue(entity.getResponseTimeValue());
        dto.setResponseTimeUnit(entity.getResponseTimeUnit());
        dto.setResolutionTimeValue(entity.getResolutionTimeValue());
        dto.setResolutionTimeUnit(entity.getResolutionTimeUnit());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getEscalationRules() != null) {
            dto.setEscalationRules(
                    entity.getEscalationRules()
                            .stream()
                            .map(this::toDTO)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public SLAPolicy toEntity(SLAPolicyDTO dto) {
        if (dto == null) return null;

        SLAPolicy entity = new SLAPolicy();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDepartment(dto.getDepartment());
        entity.setPriority(dto.getPriority());
        entity.setStatus(dto.getStatus());
        entity.setResponseTimeValue(dto.getResponseTimeValue());
        entity.setResponseTimeUnit(dto.getResponseTimeUnit());
        entity.setResolutionTimeValue(dto.getResolutionTimeValue());
        entity.setResolutionTimeUnit(dto.getResolutionTimeUnit());

        if (dto.getEscalationRules() != null) {
            dto.getEscalationRules().forEach(ruleDto -> {
                EscalationRule rule = toEntity(ruleDto);
                entity.addEscalationRule(rule);
            });
        }

        return entity;
    }

    public EscalationRuleDTO toDTO(EscalationRule entity) {
        if (entity == null) return null;

        EscalationRuleDTO dto = new EscalationRuleDTO();
        dto.setId(entity.getId());
        dto.setLevel(entity.getLevel());
        dto.setAfterValue(entity.getAfterValue());
        dto.setAfterUnit(entity.getAfterUnit());
        dto.setEscalateTo(entity.getEscalateTo());
        dto.setIncreasePriority(entity.getIncreasePriority());

        return dto;
    }

    public EscalationRule toEntity(EscalationRuleDTO dto) {
        if (dto == null) return null;

        EscalationRule entity = new EscalationRule();
        entity.setId(dto.getId());
        entity.setLevel(dto.getLevel());
        entity.setAfterValue(dto.getAfterValue());
        entity.setAfterUnit(dto.getAfterUnit());
        entity.setEscalateTo(dto.getEscalateTo());
        entity.setIncreasePriority(dto.getIncreasePriority());

        return entity;
    }
}