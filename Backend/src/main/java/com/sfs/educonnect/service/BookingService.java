package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.BookingRequestDto;
import com.sfs.educonnect.entity.Booking;
import com.sfs.educonnect.entity.TimeSlot;
import com.sfs.educonnect.entity.User;
import com.sfs.educonnect.enums.BookingStatus;
import com.sfs.educonnect.repository.BookingRepository;
import com.sfs.educonnect.repository.TimeSlotRepository;
import com.sfs.educonnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(BookingRequestDto request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
                
        TimeSlot timeSlot = timeSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        if (!timeSlot.getIsAvailable()) {
            throw new RuntimeException("Time slot is not available");
        }

        Booking booking = new Booking();
        booking.setStudent(student);
        booking.setTimeSlot(timeSlot);
        booking.setReason(request.getReason());
        booking.setStatus(BookingStatus.PENDING);

        // Mark the slot as unavailable
        timeSlot.setIsAvailable(false);
        timeSlotRepository.save(timeSlot);

        return bookingRepository.save(booking);
    }

    public List<Booking> getStudentBookings(Long studentId) {
        return bookingRepository.findByStudentId(studentId);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
                
        booking.setStatus(status);
        
        // If rejected or cancelled, free up the slot
        if (status == BookingStatus.REJECTED || status == BookingStatus.CANCELLED) {
            TimeSlot slot = booking.getTimeSlot();
            slot.setIsAvailable(true);
            timeSlotRepository.save(slot);
        }
        
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking rescheduleBooking(Long bookingId, Long newSlotId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
                
        TimeSlot newSlot = timeSlotRepository.findById(newSlotId)
                .orElseThrow(() -> new RuntimeException("New time slot not found"));
                
        if (!newSlot.getIsAvailable()) {
            throw new RuntimeException("New time slot is not available");
        }
        
        // Free up old slot
        TimeSlot oldSlot = booking.getTimeSlot();
        oldSlot.setIsAvailable(true);
        timeSlotRepository.save(oldSlot);
        
        // Reserve new slot
        newSlot.setIsAvailable(false);
        timeSlotRepository.save(newSlot);
        
        booking.setTimeSlot(newSlot);
        booking.setStatus(BookingStatus.PENDING); // Need re-approval? usually yes.
        
        return bookingRepository.save(booking);
    }
}
