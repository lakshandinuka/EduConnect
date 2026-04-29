package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByAppointmentTypeIdAndIsAvailableTrue(Long typeId);
    List<TimeSlot> findByDateAndIsAvailableTrue(LocalDate date);
}
