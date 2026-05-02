package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.DuplicateResponseDTO;
import com.sfs.educonnect.dto.SaveResponseRequestDTO;
import com.sfs.educonnect.dto.SaveResponseResponseDTO;
import com.sfs.educonnect.dto.SimilarTicketDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class DuplicateDetectionService {

    @Value("${ai.duplicate.service.url:http://localhost:5001}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public DuplicateResponseDTO findDuplicates(String ticketText) {
        String url = aiServiceUrl + "/detect";
        
        Map<String, String> request = new HashMap<>();
        request.put("ticket_text", ticketText);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<SimilarTicketDTO[]> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            SimilarTicketDTO[].class
        );
        
        DuplicateResponseDTO result = new DuplicateResponseDTO();
        result.setSimilarTickets(Arrays.asList(Objects.requireNonNull(response.getBody())));
        return result;
    }
    
    public SaveResponseResponseDTO saveResponse(SaveResponseRequestDTO request) {
        String url = aiServiceUrl + "/save_response";
        
        Map<String, String> body = new HashMap<>();
        body.put("ticket_id", request.getTicketId());
        body.put("response_text", request.getResponseText());
        body.put("admin_note", request.getAdminNote() != null ? request.getAdminNote() : "");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        
        ResponseEntity<SaveResponseResponseDTO> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            SaveResponseResponseDTO.class
        );
        
        return response.getBody();
    }
}