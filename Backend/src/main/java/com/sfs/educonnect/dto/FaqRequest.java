package com.sfs.educonnect.dto;

import com.sfs.educonnect.enums.FaqStatus;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class FaqRequest {
    private String question;
    private String answer;
    private String category;
    private FaqStatus status;

    @JsonAlias("sort_order")
    private Integer sortOrder;
}
