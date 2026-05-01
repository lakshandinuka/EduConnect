package com.sfs.educonnect.dto;

import lombok.Data;

@Data
public class PolicyRequest {
    private String name;
    private String description;
    private String rules;
    private String icon;
}
