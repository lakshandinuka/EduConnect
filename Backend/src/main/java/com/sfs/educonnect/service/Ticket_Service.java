package com.sfs.educonnect.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import com.sfs.educonnect.repository.Ticket_Repository;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Service
public class Ticket_Service {

    @Autowired
    private Ticket_Repository ticketRepository;

    @Autowired
    private RestTemplate restTemplate;

    public Map<String, Object> getTotalTickets() {
        return ticketRepository.getTotalTickets();
    }

    public Map<String, Object> getResolutionStats() {
        return ticketRepository.getResolutionTimeStats();
    }

    public Map<String, Object> getSLACompliance() {
        return ticketRepository.getSLACompliance();
    }

    public List<Map<String, Object>> getSentimentDistribution() {
        return ticketRepository.getSentimentDistribution();
    }

    public List<Map<String, Object>> getTicketsByStatus() {
        return ticketRepository.getTicketsByStatus();
    }

    public List<Map<String, Object>> getAgentWorkload() {
        return ticketRepository.getAgentWorkload();
    }

    public Map<String, Object> getAvgSatisfactionScore() {
        return ticketRepository.getAvgSatisfactionScore();
    }

    public List<Map<String, Object>> getTicketTrendWithMovingAvg() {
        return ticketRepository.getTicketTrendWithMovingAvg();
    }

    public List<Map<String, Object>> getTicketTrendByDepartment() {
        return ticketRepository.getTicketTrendByDepartment();
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    public ResponseEntity<Map<String, Object>> detectAnomalies() {
        List<Map<String, Object>> ticketData = ticketRepository.getTicketFeaturesForAnomaly();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(ticketData, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "http://localhost:5001/predict", request, Map.class);

        return ResponseEntity.ok(response.getBody());
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> trainAnomalyModel() {
        List<Map<String, Object>> ticketData = ticketRepository.getTicketFeaturesForAnomaly();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(ticketData, headers);

        @SuppressWarnings("rawtypes")
        ResponseEntity<Map> response = restTemplate.postForEntity(
                "http://localhost:5001/train", request, Map.class);

        return response.getBody();
    }
}
