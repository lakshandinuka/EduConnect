package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    // Get all announcements, newest first
    List<Announcement> findAllByOrderByCreatedAtDesc();

    // Get only important announcements, newest first
    List<Announcement> findByIsImportantTrueOrderByCreatedAtDesc();

    // Get announcements by semester, newest first
    List<Announcement> findBySemesterOrderByCreatedAtDesc(String semester);
}
