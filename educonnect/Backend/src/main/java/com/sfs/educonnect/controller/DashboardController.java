package com.sfs.educonnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.sfs.educonnect.service.Ticket_Service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class DashboardController {

    @Autowired
    private Ticket_Service ticketService;

    @GetMapping("/total")
    public Map<String, Object> getTotalTickets() {
        return ticketService.getTotalTickets();
    }

    @GetMapping("/resolution")
    public Map<String, Object> getResolutionStats() {
        return ticketService.getResolutionStats();
    }

    @GetMapping("/sla")
    public Map<String, Object> getSLACompliance() {
        return ticketService.getSLACompliance();
    }

    @GetMapping("/sentiment")
    public List<Map<String, Object>> getSentiment() {
        return ticketService.getSentimentDistribution();
    }

    @GetMapping("/status")
    public List<Map<String, Object>> getStatus() {
        return ticketService.getTicketsByStatus();
    }

    @GetMapping("/agents")
    public List<Map<String, Object>> getAgentWorkload() {
        return ticketService.getAgentWorkload();
    }

    @GetMapping("/satisfaction")
    public Map<String, Object> getSatisfaction() {
        return ticketService.getAvgSatisfactionScore();
    }

    @GetMapping("/trend-moving-avg")
    public List<Map<String, Object>> getTrendWithMovingAvg() {
        return ticketService.getTicketTrendWithMovingAvg();
    }

    @GetMapping("/anomaly")
    public ResponseEntity<Map<String, Object>> getAnomalies() {
        return ticketService.detectAnomalies();
    }

    @GetMapping("/anomaly/train")
    public Map<String, Object> trainModel() {
        return ticketService.trainAnomalyModel();
    }

    @GetMapping("/trend-by-department")
    public List<Map<String, Object>> getTrendByDepartment() {
        return ticketService.getTicketTrendByDepartment();
    }

}