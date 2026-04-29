package com.sfs.educonnect.config;

import com.sfs.educonnect.entity.*;
import com.sfs.educonnect.enums.Role;
import com.sfs.educonnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentTypeRepository appointmentTypeRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            Department dept = new Department("Computer Science");
            departmentRepository.save(dept);

            User student = new User();
            student.setFullName("Test Student");
            student.setEmail("student@test.com");
            student.setPassword("password");
            student.setRole(Role.STUDENT);
            student.setDepartment(dept);
            userRepository.save(student);

            User staff = new User();
            staff.setFullName("Test Content Creator");
            staff.setEmail("staff@test.com");
            staff.setPassword("password");
            staff.setRole(Role.DEPT_ADMIN);
            staff.setDepartment(dept);
            userRepository.save(staff);

            AppointmentType type = AppointmentType.builder()
                    .title("Academic Advising")
                    .description("Brief meeting to discuss courses")
                    .duration(30)
                    .department(dept)
                    .createdBy(staff)
                    .build();
            appointmentTypeRepository.save(type);

            TimeSlot slot1 = TimeSlot.builder()
                    .appointmentType(type)
                    .date(LocalDate.now())
                    .startTime(LocalTime.of(10, 0))
                    .endTime(LocalTime.of(10, 30))
                    .isAvailable(true)
                    .createdBy(staff)
                    .build();
            timeSlotRepository.save(slot1);

            TimeSlot slot2 = TimeSlot.builder()
                    .appointmentType(type)
                    .date(LocalDate.now())
                    .startTime(LocalTime.of(14, 0))
                    .endTime(LocalTime.of(14, 30))
                    .isAvailable(true)
                    .createdBy(staff)
                    .build();
            timeSlotRepository.save(slot2);

            TimeSlot slot3 = TimeSlot.builder()
                    .appointmentType(type)
                    .date(LocalDate.now().plusDays(1))
                    .startTime(LocalTime.of(9, 15))
                    .endTime(LocalTime.of(9, 45))
                    .isAvailable(true)
                    .createdBy(staff)
                    .build();
            timeSlotRepository.save(slot3);

            System.out.println("====== Database seeded with Mock Data ======");
            System.out.println("Created mock student ID: " + student.getId());
            System.out.println("Created mock time slot ID: " + slot1.getId());
        }
    }
}
