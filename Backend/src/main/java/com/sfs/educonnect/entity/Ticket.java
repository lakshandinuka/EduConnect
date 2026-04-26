package com.sfs.educonnect.entity;

import com.sfs.educonnect.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", unique = true)
    private String ticketId;

    // --- Relationships ---
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "inquiry_type_id")
    private InquiryType inquiryType;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments = new ArrayList<>();

    // --- Fields from legacy data (including read‑only departmentId) ---
    @Column(name = "student_name")
    private String studentName;

    @Column(name = "student_email")
    private String studentEmail;

    private String category;
    private String priority;

    @Column(name = "legacy_status")
    private String status; // string version of status

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "agent_name")
    private String agentName;

    @Column(name = "first_response_at")
    private LocalDateTime firstResponseAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "satisfaction_score")
    private Integer satisfactionScore;

    @Column(name = "department") // string version of department name
    private String departmentName;

    // This maps to the same column as department.id – make it read‑only
    @Column(name = "department_id", insertable = false, updatable = false)
    private Integer departmentId; // kept for convenience (e.g., DTOs)

    private String channel;

    @Column(name = "channel_id")
    private Integer channelId;

    @Column(name = "reassignment_count")
    private Integer reassignmentCount = 0;

    @Column(name = "ticket_reopen_count")
    private Integer ticketReopenCount = 0;

    @Column(name = "message_count")
    private Integer messageCount = 1;

    private Integer escalated = 0;

    @Column(name = "time_to_first_escalation_mins")
    private Integer timeToFirstEscalationMins = 0;

    @Column(name = "num_attachments")
    private Integer numAttachments = 0;

    @Column(name = "previous_tickets_by_customer")
    private Integer previousTicketsByCustomer = 0;

    @Column(name = "knowledge_base_used")
    private Integer knowledgeBaseUsed = 0;

    @Column(name = "auto_categorized")
    private Integer autoCategorized = 0;

    @Column(name = "duplicate_flag")
    private Integer duplicateFlag = 0;

    @Column(name = "sla_due_at")
    private LocalDateTime slaDueAt;

    @Column(name = "reopen_count")
    private Integer reopenCount = 0;

    private String sentiment;

    // --- Fields from the new schema ---
    @Column(nullable = false, columnDefinition = "TEXT")
    private String inquiryText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus ticketStatus = TicketStatus.OPEN;

    @CreationTimestamp
    @Column(name = "system_created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "system_updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "ticket_created_at")
    private LocalDateTime ticketCreatedAt;
}