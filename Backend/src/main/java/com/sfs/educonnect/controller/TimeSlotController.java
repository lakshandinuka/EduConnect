package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.TimeSlot;
import com.sfs.educonnect.service.TimeSlotService;
import com.sfs.educonnect.repository.TimeSlotRepository;
import com.sfs.educonnect.repository.AppointmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class TimeSlotController {

    private final TimeSlotService timeSlotService;
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentTypeRepository typeRepository;

    @GetMapping("/available/{typeId}")
    public ResponseEntity<List<TimeSlot>> getAvailableSlots(@PathVariable Long typeId) {
        return ResponseEntity.ok(timeSlotService.getAvailableSlotsByType(typeId));
    }

    @GetMapping
    public ResponseEntity<List<TimeSlot>> getAllSlots() {
        return ResponseEntity.ok(timeSlotRepository.findAll());
    }

    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        timeSlotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<?> createSlot(@RequestBody Map<String, Object> payload) {
        TimeSlot slot = new TimeSlot();
        slot.setDate(LocalDate.parse(payload.get("date").toString()));
        slot.setStartTime(LocalTime.parse(payload.get("startTime").toString()));
        slot.setEndTime(LocalTime.parse(payload.get("endTime").toString()));
        slot.setIsAvailable(true);
        Long typeId = Long.valueOf(payload.get("typeId").toString());
        slot.setAppointmentType(typeRepository.findById(typeId).orElseThrow());

        return ResponseEntity.ok(timeSlotRepository.save(slot));
    }
}
