package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByName(String name);

    List<Policy> findAllByOrderByNameAsc();
}
