package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Department;
import com.sfs.educonnect.entity.Ticket;
import com.sfs.educonnect.entity.User;
import com.sfs.educonnect.enums.TicketStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStudentOrderByCreatedAtDesc(User student);

    List<Ticket> findByDepartmentOrderByCreatedAtDesc(Department department);

    List<Ticket> findByDepartmentAndStatusOrderByCreatedAtDesc(Department department, TicketStatus status);

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findAllByStatusOrderByCreatedAtDesc(TicketStatus status);
}
