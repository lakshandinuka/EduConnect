package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.ChatMessageRequest;
import com.sfs.educonnect.service.KbChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class KbChatController {
    private final KbChatService kbChatService;

    @PostMapping("/message")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> message(@RequestBody ChatMessageRequest request) throws Exception {
        return kbChatService.message(request);
    }
}
