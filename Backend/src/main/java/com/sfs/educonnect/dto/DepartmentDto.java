package com.sfs.educonnect.dto;

import lombok.Data;

@Data
public class DepartmentDto {
    private Long id;
    private String name;

    public DepartmentDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}