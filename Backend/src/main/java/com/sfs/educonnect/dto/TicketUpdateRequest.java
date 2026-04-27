package com.sfs.educonnect.dto;

import com.sfs.educonnect.enums.TicketStatus;
import lombok.Data;

@Data
public class TicketUpdateRequest {
    private TicketStatus status; // new status
    private String comment; // admin comment
    private Long newDepartmentId; // optional: reassign to another department
}