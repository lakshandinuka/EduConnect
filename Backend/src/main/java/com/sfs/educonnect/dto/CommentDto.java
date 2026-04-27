package com.sfs.educonnect.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String authorName;
    private String authorRole;
    private String text;
    private LocalDateTime createdAt;
}
