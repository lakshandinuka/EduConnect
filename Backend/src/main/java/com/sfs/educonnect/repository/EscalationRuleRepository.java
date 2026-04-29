package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.EscalationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationRuleRepository extends JpaRepository<EscalationRule, Long> {

    List<EscalationRule> findBySlaPolicyIdOrderByLevelAsc(Long slaPolicyId);
}