package com.sfs.educonnect.service;

import com.sfs.educonnect.entity.TimeSlot;
import com.sfs.educonnect.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public List<TimeSlot> getAvailableSlotsByType(Long typeId) {
        return timeSlotRepository.findByAppointmentTypeIdAndIsAvailableTrue(typeId);
    }
}
