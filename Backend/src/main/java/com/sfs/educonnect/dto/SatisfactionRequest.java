package com.sfs.educonnect.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SatisfactionRequest {
    @NotNull
    @Min(1)
    @Max(5)
    private Integer score;
}
