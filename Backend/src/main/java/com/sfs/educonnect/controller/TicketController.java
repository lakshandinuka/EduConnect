package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.TicketRequest;
import com.sfs.educonnect.dto.TicketResponse;
import com.sfs.educonnect.entity.Ticket;
import com.sfs.educonnect.entity.User;
import com.sfs.educonnect.repository.TicketRepository;
import com.sfs.educonnect.security.JwtUtil;
import com.sfs.educonnect.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TicketRepository ticketRepository;

    // Helper to get current user id from token (assuming it's set in
    // SecurityContext)
    // We can extract from request header or from SecurityContextHolder.
    // For simplicity, we'll add a method to get from request or token.
    // Alternative: use @AuthenticationPrincipal but need custom UserDetails.
    // We'll use request header to get token and extract userId.
    private Long getCurrentUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createTicket(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TicketRequest request) {
        try {
            Long studentId = getCurrentUserId(authHeader);
            TicketResponse response = ticketService.createTicket(studentId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyTickets(@RequestHeader("Authorization") String authHeader) {
        try {
            Long studentId = getCurrentUserId(authHeader);
            List<TicketResponse> tickets = ticketService.getTicketsByStudent(studentId);
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{ticketId}/attachments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> addAttachment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file) {
        try {
            Long studentId = getCurrentUserId(authHeader);
            TicketResponse response = ticketService.addAttachment(ticketId, studentId, file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{ticketId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> deleteTicket(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId) {
        try {
            Long studentId = getCurrentUserId(authHeader);
            ticketService.deleteTicket(ticketId, studentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @SuppressWarnings("null")
    @GetMapping("/{ticketId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getTicketById(
            @AuthenticationPrincipal User student, // Injects the logged-in student
            @PathVariable Long ticketId) {
        try {
            Ticket ticket = ticketRepository.findById(ticketId)
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));

            // Security: ensure the ticket belongs to this student
            if (!ticket.getStudent().getId().equals(student.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You are not authorized to view this ticket");
            }

            TicketResponse response = ticketService.mapToResponse(ticket);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
