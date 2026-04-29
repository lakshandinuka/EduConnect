package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.SLAPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SLAPolicyRepository extends JpaRepository<SLAPolicy, Long> {
}