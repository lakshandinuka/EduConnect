package com.sfs.educonnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "escalation_rules")
public class EscalationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer level;

    private Integer afterValue;

    private String afterUnit;

    private String escalateTo;

    private Boolean increasePriority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sla_policy_id", nullable = false)
    private SLAPolicy slaPolicy;

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Integer getLevel() { return level; }

    public void setLevel(Integer level) { this.level = level; }

    public Integer getAfterValue() { return afterValue; }

    public void setAfterValue(Integer afterValue) { this.afterValue = afterValue; }

    public String getAfterUnit() { return afterUnit; }

    public void setAfterUnit(String afterUnit) { this.afterUnit = afterUnit; }

    public String getEscalateTo() { return escalateTo; }

    public void setEscalateTo(String escalateTo) { this.escalateTo = escalateTo; }

    public Boolean getIncreasePriority() { return increasePriority; }

    public void setIncreasePriority(Boolean increasePriority) { this.increasePriority = increasePriority; }

    public SLAPolicy getSlaPolicy() { return slaPolicy; }

    public void setSlaPolicy(SLAPolicy slaPolicy) { this.slaPolicy = slaPolicy; }
}