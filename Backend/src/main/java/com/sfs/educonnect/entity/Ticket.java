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

    @ManyToOne
    @JoinColumn(name = "sla_policy_id")
    private SLAPolicy slaPolicy;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments = new ArrayList<>();

    // --- Fields from legacy data ---
    @Column(name = "student_name")
    private String studentName;

    @Column(name = "student_email")
    private String studentEmail;

    private String category;
    private String priority;

    @Column(name = "legacy_status")
    private String status;

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

    @Column(name = "department")
    private String departmentName;

    // ✅ FIXED TYPE HERE (Integer → Long)
    @Column(name = "department_id", insertable = false, updatable = false)
    private Long departmentId;

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

    // --- New schema ---
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

    // --- Priority Prediction ---
    @Column(name = "predicted_priority")
    private Integer predictedPriority;

    @Column(name = "predicted_priority_label")
    private String predictedPriorityLabel;

    @Column(name = "priority_confidence")
    private Double priorityConfidence;
}