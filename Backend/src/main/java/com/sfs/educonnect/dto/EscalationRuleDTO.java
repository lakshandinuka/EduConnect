package com.sfs.educonnect.dto;

import lombok.Data;

@Data
public class EscalationRuleDTO {

    private Long id;

    private Integer level;

    private Integer afterValue;

    private String afterUnit;

    private String escalateTo;

    private Boolean increasePriority;
}