package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.Announcement;
import com.sfs.educonnect.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/announcements")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AdminAnnouncementController {

    private final AnnouncementService service;
    private final com.sfs.educonnect.security.JwtUtil jwtUtil;

    public AdminAnnouncementController(AnnouncementService service, com.sfs.educonnect.security.JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'DEPT_ADMIN')")
    public ResponseEntity<Announcement> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Announcement announcement) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        announcement.setAdminId(userId);
        return ResponseEntity.ok(service.create(announcement));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'DEPT_ADMIN')")
    public ResponseEntity<Announcement> update(@PathVariable Long id, @RequestBody Announcement announcement) {
        return ResponseEntity.ok(service.update(id, announcement));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'DEPT_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
