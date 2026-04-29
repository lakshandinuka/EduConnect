package com.sfs.educonnect.entity;

import com.sfs.educonnect.enums.SLAPriority;
import com.sfs.educonnect.enums.SLAStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sla_policies")
public class SLAPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String department;

    @Enumerated(EnumType.STRING)
    private SLAPriority priority;

    @Enumerated(EnumType.STRING)
    private SLAStatus status;

    private Integer responseTimeValue;
    private String responseTimeUnit;

    private Integer resolutionTimeValue;
    private String resolutionTimeUnit;

    @OneToMany(mappedBy = "slaPolicy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EscalationRule> escalationRules = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }

    public void setDepartment(String department) { this.department = department; }

    public SLAPriority getPriority() { return priority; }

    public void setPriority(SLAPriority priority) { this.priority = priority; }

    public SLAStatus getStatus() { return status; }

    public void setStatus(SLAStatus status) { this.status = status; }

    public Integer getResponseTimeValue() { return responseTimeValue; }

    public void setResponseTimeValue(Integer responseTimeValue) { this.responseTimeValue = responseTimeValue; }

    public String getResponseTimeUnit() { return responseTimeUnit; }

    public void setResponseTimeUnit(String responseTimeUnit) { this.responseTimeUnit = responseTimeUnit; }

    public Integer getResolutionTimeValue() { return resolutionTimeValue; }

    public void setResolutionTimeValue(Integer resolutionTimeValue) { this.resolutionTimeValue = resolutionTimeValue; }

    public String getResolutionTimeUnit() { return resolutionTimeUnit; }

    public void setResolutionTimeUnit(String resolutionTimeUnit) { this.resolutionTimeUnit = resolutionTimeUnit; }

    public List<EscalationRule> getEscalationRules() { return escalationRules; }

    public void setEscalationRules(List<EscalationRule> escalationRules) { this.escalationRules = escalationRules; }

    public void addEscalationRule(EscalationRule rule) {
        escalationRules.add(rule);
        rule.setSlaPolicy(this);
    }

    public void removeEscalationRule(EscalationRule rule) {
        escalationRules.remove(rule);
        rule.setSlaPolicy(null);
    }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}