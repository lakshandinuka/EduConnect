package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.SLAPolicyDTO;

import java.util.List;

public interface SLAPolicyService {

    SLAPolicyDTO createPolicy(SLAPolicyDTO policyDTO);

    List<SLAPolicyDTO> getAllPolicies();

    SLAPolicyDTO getPolicyById(Long id);

    SLAPolicyDTO updatePolicy(Long id, SLAPolicyDTO policyDTO);

    void deletePolicy(Long id);

    // Escalation logic (can be expanded later)
    boolean evaluateTicketEscalation(Long ticketId, Long slaPolicyId);

    void triggerEscalationRules(Long slaPolicyId);
}