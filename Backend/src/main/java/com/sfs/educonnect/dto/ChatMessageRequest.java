package com.sfs.educonnect.dto;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private String message;
    private String conversationId;
}
