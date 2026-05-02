package com.sfs.educonnect.dto;

import com.sfs.educonnect.enums.SLAPriority;
import com.sfs.educonnect.enums.SLAStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class SLAPolicyDTO {

    private Long id;

    private String name;

    private String department;

    private SLAPriority priority;

    private SLAStatus status;

    // Flat fields used by backend/entity
    private Integer responseTimeValue;
    private String responseTimeUnit;

    private Integer resolutionTimeValue;
    private String resolutionTimeUnit;

    // Nested fields sent by frontend form
    private TimeConfig responseTime;
    private TimeConfig resolutionTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<EscalationRuleDTO> escalationRules = new ArrayList<>();

    public Integer getResponseTimeValue() {
        if (responseTimeValue != null) {
            return responseTimeValue;
        }
        return responseTime != null ? responseTime.getValue() : null;
    }

    public String getResponseTimeUnit() {
        if (responseTimeUnit != null) {
            return responseTimeUnit;
        }
        return responseTime != null ? responseTime.getUnit() : null;
    }

    public Integer getResolutionTimeValue() {
        if (resolutionTimeValue != null) {
            return resolutionTimeValue;
        }
        return resolutionTime != null ? resolutionTime.getValue() : null;
    }

    public String getResolutionTimeUnit() {
        if (resolutionTimeUnit != null) {
            return resolutionTimeUnit;
        }
        return resolutionTime != null ? resolutionTime.getUnit() : null;
    }

    public void setResponseTimeValue(Integer responseTimeValue) {
        this.responseTimeValue = responseTimeValue;
    }

    public void setResponseTimeUnit(String responseTimeUnit) {
        this.responseTimeUnit = responseTimeUnit;
    }

    public void setResolutionTimeValue(Integer resolutionTimeValue) {
        this.resolutionTimeValue = resolutionTimeValue;
    }

    public void setResolutionTimeUnit(String resolutionTimeUnit) {
        this.resolutionTimeUnit = resolutionTimeUnit;
    }

    @Data
    public static class TimeConfig {
        private Integer value;
        private String unit;
    }
}