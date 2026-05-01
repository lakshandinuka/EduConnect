package com.sfs.educonnect.service;

import com.sfs.educonnect.entity.Ticket;
import com.sfs.educonnect.enums.TicketStatus;
import com.sfs.educonnect.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SLAEscalationService {

    @Autowired
    private TicketRepository ticketRepository;

    @Scheduled(fixedRate = 60000)
    public void checkSlaBreaches() {
        List<Ticket> overdueTickets =
                ticketRepository.findBySlaDueAtBeforeAndEscalated(LocalDateTime.now(), 0);

        System.out.println("SLA scheduler running at " + LocalDateTime.now()
                + " | overdue tickets: " + overdueTickets.size());

        for (Ticket ticket : overdueTickets) {
            if (ticket.getTicketStatus() != TicketStatus.RESOLVED
                    && ticket.getTicketStatus() != TicketStatus.APPROVED
                    && ticket.getTicketStatus() != TicketStatus.REJECTED) {

                ticket.setEscalated(1);
                ticket.setTicketStatus(TicketStatus.ESCALATED);
                ticket.setTimeToFirstEscalationMins(0);

                ticketRepository.save(ticket);

                System.out.println("Ticket #" + ticket.getId()
                        + " auto escalated. SLA due at: " + ticket.getSlaDueAt());
            }
        }
    }
}