package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.Booking;
import com.sfs.educonnect.enums.BookingStatus;
import com.sfs.educonnect.dto.BookingRequestDto;
import com.sfs.educonnect.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDto request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Booking>> getStudentBookings(@PathVariable Long studentId) {
        return ResponseEntity.ok(bookingService.getStudentBookings(studentId));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long bookingId, @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/{bookingId}/reschedule")
    public ResponseEntity<Booking> rescheduleBooking(@PathVariable Long bookingId, @RequestParam Long newSlotId) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(bookingId, newSlotId));
    }
}
