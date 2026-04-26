package com.sfs.educonnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequest {
    @NotNull
    private Long inquiryTypeId;

    @NotNull
    private Long departmentId;

    @NotBlank
    private String inquiryText;
}
