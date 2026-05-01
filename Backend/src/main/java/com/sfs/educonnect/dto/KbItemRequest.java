package com.sfs.educonnect.dto;

import com.sfs.educonnect.enums.KbItemStatus;
import com.sfs.educonnect.enums.KbItemType;
import lombok.Data;

@Data
public class KbItemRequest {
    private String title;
    private String description;
    private KbItemType type;
    private KbItemStatus status;
    private Long categoryId;
    private String content;
    private String pdfUrl;
    private Long policyId;
    private Boolean isFeatured;
    private Boolean isRecommended;
}
