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

    private Integer responseTimeValue;
    private String responseTimeUnit;

    private Integer resolutionTimeValue;
    private String resolutionTimeUnit;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<EscalationRuleDTO> escalationRules = new ArrayList<>();
}