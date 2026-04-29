package com.sfs.educonnect.dto;

import com.sfs.educonnect.enums.UrgencyLevel;
import lombok.Data;

@Data
public class BookingRequestDto {
    private Long studentId;
    private Long slotId;
    private Long departmentId;
    private Long appointmentTypeId;
    private String reason;
    private UrgencyLevel urgencyLevel;
}
