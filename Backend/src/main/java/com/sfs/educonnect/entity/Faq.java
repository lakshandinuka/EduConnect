package com.sfs.educonnect.entity;

import com.sfs.educonnect.enums.FaqStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "faqs",
        indexes = {
                @Index(name = "idx_faq_status", columnList = "status"),
                @Index(name = "idx_faq_category", columnList = "category")
        }
)
@Data
@NoArgsConstructor
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 512)
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false, length = 120)
    private String category = "General";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FaqStatus status = FaqStatus.PUBLISHED;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
