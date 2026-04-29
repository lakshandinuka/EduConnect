package com.sfs.educonnect.service;

import com.sfs.educonnect.entity.Announcement;
import com.sfs.educonnect.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository repository;

    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    // Create new announcement
    @SuppressWarnings("null")
    public Announcement create(Announcement announcement) {
        return repository.save(announcement);
    }

    // Update existing announcement
    @SuppressWarnings("null")
    public Announcement update(Long id, Announcement updated) {
        Announcement existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setSemester(updated.getSemester());
        existing.setIsImportant(updated.getIsImportant());
        existing.setExpiry(updated.getExpiry()); // <-- NEW
        return repository.save(existing);
    }

    // Delete
    @SuppressWarnings("null")
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Get all announcements (latest first)
    public List<Announcement> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    // Get only important announcements
    public List<Announcement> getImportant() {
        return repository.findByIsImportantTrueOrderByCreatedAtDesc();
    }

    // Get announcements by semester
    public List<Announcement> getBySemester(String semester) {
        return repository.findBySemesterOrderByCreatedAtDesc(semester);
    }
}
