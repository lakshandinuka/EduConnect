package com.sfs.educonnect.service;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// src/main/java/com/yourapp/service/PriorityPredictionService.java
@Service
public class PriorityPredictionService {

    private final RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;

    public PriorityPredictionService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public PriorityResult predictPriority(String processedText) {
        Map<String, String> request = Map.of("text", processedText);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    mlServiceUrl + "/predict", request, Map.class);
            Map body = response.getBody();
            return new PriorityResult(
                    (Integer) body.get("priority"),
                    (String) body.get("priority_label"),
                    (Double) body.get("confidence"));
        } catch (Exception e) {
            // Fallback: default to MEDIUM if ML service is down
            return new PriorityResult(1, "MEDIUM", 0.0);
        }
    }

    public record PriorityResult(int priority, String priorityLabel, double confidence) {
    }
}
