package com.sfs.educonnect.dto;

import lombok.Data;
import java.util.List;

@Data
public class DuplicateResponseDTO {
    private List<SimilarTicketDTO> similarTickets;
}