package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.PageContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PageContentRepository extends JpaRepository<PageContent, Long> {
    Optional<PageContent> findByPageKey(String pageKey);
}
