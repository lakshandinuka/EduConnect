package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.AppointmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentTypeRepository extends JpaRepository<AppointmentType, Long> {
    List<AppointmentType> findByDepartmentId(Long departmentId);
}
