package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.InquiryType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InquiryTypeRepository extends JpaRepository<InquiryType, Long> {
    Optional<InquiryType> findByName(String name);
}
