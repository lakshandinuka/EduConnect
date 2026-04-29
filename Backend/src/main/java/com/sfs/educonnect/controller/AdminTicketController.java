package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.ApprovalRequest;
import com.sfs.educonnect.dto.TicketResponse;
import com.sfs.educonnect.dto.TicketUpdateRequest;
import com.sfs.educonnect.entity.User;
import com.sfs.educonnect.enums.TicketStatus;
import com.sfs.educonnect.security.JwtUtil;
import com.sfs.educonnect.service.TicketService;
import com.sfs.educonnect.service.UserService; // need to get user by id
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tickets")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AdminTicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService; // we'll need this to fetch user by id

    @Autowired
    private JwtUtil jwtUtil;

    private User getCurrentUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing token");
        }
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        return userService.findById(userId); // must load full User (role, department)
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DEPT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getTickets(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String status) {
        try {
            User admin = getCurrentUser(authHeader); // your existing helper
            TicketStatus ticketStatus = null;
            if (status != null && !status.isEmpty()) {
                ticketStatus = TicketStatus.valueOf(status.toUpperCase());
            }
            List<TicketResponse> tickets = ticketService.getTicketsForAdmin(admin, ticketStatus);
            return ResponseEntity.ok(tickets);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + status);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{ticketId}")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> updateTicket(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId,
            @RequestBody TicketUpdateRequest request) {
        try {
            User admin = getCurrentUser(authHeader);
            TicketResponse response = ticketService.updateTicket(ticketId, admin, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{ticketId}/submit-approval")
    @PreAuthorize("hasRole('DEPT_ADMIN')")
    public ResponseEntity<?> submitForApproval(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId,
            @RequestBody ApprovalRequest request) {
        try {
            User admin = getCurrentUser(authHeader);
            TicketResponse response = ticketService.submitForApproval(ticketId, admin, request.getComment());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{ticketId}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approveTicket(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId,
            @RequestBody ApprovalRequest request) {
        try {
            User admin = getCurrentUser(authHeader);
            TicketResponse response = ticketService.approveTicket(ticketId, admin, request.getComment());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{ticketId}/reject")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> rejectTicket(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId,
            @RequestBody ApprovalRequest request) {
        try {
            User admin = getCurrentUser(authHeader);
            TicketResponse response = ticketService.rejectTicket(ticketId, admin, request.getComment());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{ticketId}")
    @PreAuthorize("hasAnyRole('DEPT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getTicketById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long ticketId) {
        try {
            User admin = getCurrentUser(authHeader);
            TicketResponse response = ticketService.getTicketByIdForAdmin(ticketId, admin);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
