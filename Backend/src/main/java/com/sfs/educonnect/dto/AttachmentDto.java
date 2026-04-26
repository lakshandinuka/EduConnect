package com.sfs.educonnect.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AttachmentDto {
    private Long id;
    private String fileName;
    private String fileUrl; // URL to download the file
    private LocalDateTime uploadedAt;
}