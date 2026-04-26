package com.sfs.educonnect.enums;

public enum TicketStatus {
    OPEN, // newly created, not yet assigned/processed
    IN_PROGRESS, // admin is working on it
    RESOLVED, // solved by admin, awaiting approval from super admin
    APPROVED, // approved by super admin, closed
    REJECTED // sent back by super admin
}