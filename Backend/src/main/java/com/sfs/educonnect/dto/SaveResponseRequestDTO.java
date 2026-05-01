package com.sfs.educonnect.dto;

import lombok.Data;

@Data
public class SaveResponseRequestDTO {
    private String ticketId;
    private String responseText;
    private String adminNote;   // optional
}