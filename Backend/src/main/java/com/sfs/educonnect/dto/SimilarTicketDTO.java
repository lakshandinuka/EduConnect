package com.sfs.educonnect.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class SimilarTicketDTO {
    @JsonAlias("ticket_id")
    private String ticketId;
    private Double similarity;
    private String text;
    @JsonAlias("existing_response")
    private String existingResponse;
}
