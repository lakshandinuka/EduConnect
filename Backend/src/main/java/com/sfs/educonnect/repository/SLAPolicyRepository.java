package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.SLAPolicy;
import com.sfs.educonnect.enums.SLAPriority;
import com.sfs.educonnect.enums.SLAStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SLAPolicyRepository extends JpaRepository<SLAPolicy, Long> {

    Optional<SLAPolicy> findByDepartmentAndPriorityAndStatus(
            String department,
            SLAPriority priority,
            SLAStatus status
    );
}