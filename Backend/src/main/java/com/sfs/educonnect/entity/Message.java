package com.sfs.educonnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender; // student or admin

    private String content;

    private LocalDateTime createdAt;

    private boolean replied = false;

    private String reply;

    public Message() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters

    public Long getId() { return id; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public boolean isReplied() { return replied; }
    public void setReplied(boolean replied) { this.replied = replied; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}
