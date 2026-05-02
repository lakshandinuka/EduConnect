package com.sfs.educonnect.dto;

import lombok.Data;

@Data
public class SimilarTicketDTO {
    private String ticketId;
    private Double similarity;
    private String text;
    private String existingResponse;
}