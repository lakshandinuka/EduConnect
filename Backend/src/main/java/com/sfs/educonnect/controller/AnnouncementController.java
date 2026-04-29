package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.Announcement;
import com.sfs.educonnect.service.AnnouncementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    // ✅ ONLY GET METHODS HERE

    @GetMapping
    public List<Announcement> getAnnouncements(
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) Boolean important) {

        if (semester != null && !semester.isEmpty()) {
            return service.getBySemester(semester);
        }

        if (Boolean.TRUE.equals(important)) {
            return service.getImportant();
        }

        return service.getAll();
    }
}
