package com.sfs.educonnect.dto;

import com.sfs.educonnect.enums.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponse {
    private Long id;
    private String studentName;
    private String studentEmail;
    private String studentPhoneNumber;
    private Long inquiryTypeId;
    private String inquiryTypeName;
    private String departmentName;
    private String inquiryText;
    private String status;
    private List<AttachmentDto> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDto> comments;
}