package com.sfs.educonnect.entity;

import com.sfs.educonnect.enums.KbItemStatus;
import com.sfs.educonnect.enums.KbItemType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "kb_items",
        indexes = {
                @Index(name = "idx_kb_status", columnList = "status"),
                @Index(name = "idx_kb_category", columnList = "category_id")
        }
)
@Data
@NoArgsConstructor
public class KbItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KbItemType type = KbItemType.ARTICLE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KbItemStatus status = KbItemStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "pdf_url", length = 1024)
    private String pdfUrl;

    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;

    @Column(name = "is_recommended", nullable = false)
    private boolean recommended = false;

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
