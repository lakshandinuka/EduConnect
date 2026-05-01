package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.AttachmentDto;
import com.sfs.educonnect.dto.CommentDto;
import com.sfs.educonnect.dto.TicketRequest;
import com.sfs.educonnect.dto.TicketResponse;
import com.sfs.educonnect.dto.TicketUpdateRequest;
import com.sfs.educonnect.entity.Attachment;
import com.sfs.educonnect.entity.Comment;
import com.sfs.educonnect.entity.Department;
import com.sfs.educonnect.entity.Ticket;
import com.sfs.educonnect.entity.User;
import com.sfs.educonnect.entity.InquiryType;
import com.sfs.educonnect.enums.Role;
import com.sfs.educonnect.enums.TicketStatus;
import com.sfs.educonnect.repository.AttachmentRepository;
import com.sfs.educonnect.repository.DepartmentRepository;
import com.sfs.educonnect.repository.InquiryTypeRepository;
import com.sfs.educonnect.repository.TicketRepository;
import com.sfs.educonnect.repository.UserRepository;
import com.sfs.educonnect.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private InquiryTypeRepository inquiryTypeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PriorityPredictionService priorityPredictionService; // <-- NEW

    @SuppressWarnings("null")
    public TicketResponse createTicket(Long studentId, TicketRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        InquiryType inquiryType = inquiryTypeRepository.findById(request.getInquiryTypeId())
                .orElseThrow(() -> new RuntimeException("Inquiry type not found"));

        // ---- Priority prediction (merged) ----
        String processedText = preprocessText(request.getInquiryText());
        PriorityPredictionService.PriorityResult result = priorityPredictionService.predictPriority(processedText);
        // ------------------------------------

        Ticket ticket = new Ticket();
        ticket.setStudent(student);
        ticket.setInquiryType(inquiryType);
        ticket.setDepartment(department);
        ticket.setInquiryText(request.getInquiryText());
        ticket.setTicketStatus(TicketStatus.OPEN);

        // Store prediction results
        ticket.setPredictedPriority(result.priority());
        ticket.setPredictedPriorityLabel(result.priorityLabel());
        ticket.setPriorityConfidence(result.confidence());

        ticket = ticketRepository.save(ticket);
        return mapToResponse(ticket);
    }

    /**
     * Preprocesses raw text to match the training pipeline:
     * lowercases and removes non-alphanumeric characters (retains spaces).
     */
    private String preprocessText(String raw) {
        if (raw == null)
            return "";
        return raw.toLowerCase().replaceAll("[^a-z0-9\\s]", "").trim();
    }

    @SuppressWarnings("null")
    public List<TicketResponse> getTicketsByStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        List<Ticket> tickets = ticketRepository.findByStudentOrderByCreatedAtDesc(student);
        return tickets.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public TicketResponse addAttachment(Long ticketId, Long studentId, MultipartFile file) throws IOException {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Security: ensure the ticket belongs to the student
        if (!ticket.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not authorized to modify this ticket");
        }

        // Only allow adding attachments if ticket is not yet resolved/approved
        if (ticket.getTicketStatus() != TicketStatus.OPEN
                && ticket.getTicketStatus() != TicketStatus.IN_PROGRESS) {
            throw new RuntimeException("Cannot add attachments to a ticket that is already resolved or closed");
        }

        String filePath = fileStorageService.storeFile(file);
        Attachment attachment = new Attachment();
        attachment.setTicket(ticket);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFilePath(filePath);
        attachmentRepository.save(attachment);

        ticket.getAttachments().add(attachment);
        return mapToResponse(ticket);
    }

    @SuppressWarnings("null")
    public void deleteTicket(Long ticketId, Long studentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not authorized to delete this ticket");
        }

        // Allow deletion only if status is OPEN (unsolved)
        if (ticket.getTicketStatus() != TicketStatus.OPEN) {
            throw new RuntimeException("Cannot delete a ticket that has already been processed");
        }

        ticketRepository.delete(ticket);
    }

    public TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setStudentName(ticket.getStudent().getFullName());
        response.setStudentEmail(ticket.getStudent().getEmail());
        response.setStudentPhoneNumber(ticket.getStudent().getPhoneNumber());
        response.setInquiryTypeId(ticket.getInquiryType().getId());
        response.setInquiryTypeName(ticket.getInquiryType().getName());
        response.setDepartmentName(ticket.getDepartment().getName());
        response.setInquiryText(ticket.getInquiryText());
        response.setStatus(ticket.getTicketStatus().name());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setPredictedPriorityLabel(ticket.getPredictedPriorityLabel());
        response.setPriorityConfidence(ticket.getPriorityConfidence());
        response.setSatisfactionScore(ticket.getSatisfactionScore());

        // Map attachments to DTOs with download URL
        List<AttachmentDto> attachmentDtos = ticket.getAttachments().stream()
                .map(att -> {
                    AttachmentDto dto = new AttachmentDto();
                    dto.setId(att.getId());
                    dto.setFileName(att.getFileName());
                    dto.setFileUrl("/api/tickets/attachments/" + att.getId()); // endpoint to serve file
                    dto.setUploadedAt(att.getUploadedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        response.setAttachments(attachmentDtos);

        List<CommentDto> commentDtos = ticket.getComments().stream()
                .map(c -> {
                    CommentDto dto = new CommentDto();
                    dto.setId(c.getId());
                    dto.setAuthorName(c.getAuthor().getFullName());
                    dto.setAuthorRole(c.getAuthor().getRole().name());
                    dto.setText(c.getText());
                    dto.setCreatedAt(c.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        response.setComments(commentDtos);

        return response;
    }

    public List<TicketResponse> getTicketsForAdmin(User admin, TicketStatus status) {
        List<Ticket> tickets;
        if (admin.getRole() == Role.SUPER_ADMIN) {
            if (status != null) {
                tickets = ticketRepository.findAllByTicketStatusOrderByCreatedAtDesc(status);
            } else {
                tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
            }
        } else if (admin.getRole() == Role.DEPT_ADMIN && admin.getDepartment() != null) {
            if (status != null) {
                tickets = ticketRepository.findByDepartmentAndTicketStatusOrderByCreatedAtDesc(admin.getDepartment(),
                        status);
            } else {
                tickets = ticketRepository.findByDepartmentOrderByCreatedAtDesc(admin.getDepartment());
            }
        } else {
            throw new RuntimeException("Invalid admin role");
        }
        return tickets.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public TicketResponse updateTicket(Long ticketId, User admin, TicketUpdateRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Check authorization: dept admin can only update tickets of their department
        if (admin.getRole() == Role.DEPT_ADMIN) {
            if (!ticket.getDepartment().getId().equals(admin.getDepartment().getId())) {
                throw new RuntimeException("You are not authorized to update this ticket");
            }
        } else if (admin.getRole() != Role.SUPER_ADMIN) {
            throw new RuntimeException("Only admins can update tickets");
        }

        // Update status if provided
        if (request.getStatus() != null) {
            ticket.setTicketStatus(request.getStatus());
        }

        // Reassign department if provided (only dept admin or super admin can reassign)
        if (request.getNewDepartmentId() != null) {
            Department newDept = departmentRepository.findById(request.getNewDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            ticket.setDepartment(newDept);
        }

        ticket = ticketRepository.save(ticket);

        // Add comment if provided
        if (request.getComment() != null && !request.getComment().trim().isEmpty()) {
            addComment(ticket, admin, request.getComment());
        }

        return mapToResponse(ticket);
    }

    @SuppressWarnings("null")
    public TicketResponse submitForApproval(Long ticketId, User admin, String comment) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Only dept admin of the ticket's department can submit
        if (admin.getRole() != Role.DEPT_ADMIN ||
                !ticket.getDepartment().getId().equals(admin.getDepartment().getId())) {
            throw new RuntimeException("Only department admin can submit for approval");
        }

        if (ticket.getTicketStatus() != TicketStatus.IN_PROGRESS
                && ticket.getTicketStatus() != TicketStatus.OPEN) {
            throw new RuntimeException("Ticket must be in progress to submit for approval");
        }

        ticket.setTicketStatus(TicketStatus.RESOLVED);
        ticket = ticketRepository.save(ticket);

        if (comment != null && !comment.trim().isEmpty()) {
            addComment(ticket, admin, comment);
        }

        return mapToResponse(ticket);
    }

    @SuppressWarnings("null")
    public TicketResponse approveTicket(Long ticketId, User superAdmin, String comment) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (superAdmin.getRole() != Role.SUPER_ADMIN) {
            throw new RuntimeException("Only super admin can approve tickets");
        }

        if (ticket.getTicketStatus() != TicketStatus.RESOLVED) {
            throw new RuntimeException("Only tickets in RESOLVED status can be approved");
        }

        ticket.setTicketStatus(TicketStatus.APPROVED);
        ticket = ticketRepository.save(ticket);

        if (comment != null && !comment.trim().isEmpty()) {
            addComment(ticket, superAdmin, comment);
        }

        return mapToResponse(ticket);
    }

    @SuppressWarnings("null")
    public TicketResponse rejectTicket(Long ticketId, User superAdmin, String comment) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (superAdmin.getRole() != Role.SUPER_ADMIN) {
            throw new RuntimeException("Only super admin can reject tickets");
        }

        if (ticket.getTicketStatus() != TicketStatus.RESOLVED) {
            throw new RuntimeException("Only tickets in RESOLVED status can be rejected");
        }

        // Set back to OPEN or IN_PROGRESS? Typically set to OPEN so admin can rework.
        ticket.setTicketStatus(TicketStatus.OPEN);
        ticket = ticketRepository.save(ticket);

        if (comment != null && !comment.trim().isEmpty()) {
            addComment(ticket, superAdmin, comment);
        }

        return mapToResponse(ticket);
    }

    private void addComment(Ticket ticket, User author, String text) {
        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setText(text);
        commentRepository.save(comment);
    }

    @SuppressWarnings("null")
    public TicketResponse getTicketByIdForStudent(Long ticketId, Long studentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(ticket);
    }

    @SuppressWarnings("null")
    public TicketResponse getTicketByIdForAdmin(Long ticketId, User admin) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Dept Admin restriction
        if (admin.getRole() == Role.DEPT_ADMIN || admin.getRole() == Role.SUPER_ADMIN) {
            if (admin.getRole() == Role.DEPT_ADMIN
                    && !ticket.getDepartment().getId().equals(admin.getDepartment().getId())) {
                throw new RuntimeException("Access denied");
            }
        } else {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(ticket);
    }

    public TicketResponse submitSatisfactionScore(Long ticketId, Long studentId, Integer score) {
    Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

    // Ensure the ticket belongs to the logged-in student
    if (!ticket.getStudent().getId().equals(studentId)) {
        throw new RuntimeException("You are not authorized to rate this ticket");
    }

    // Only approved tickets can be rated
    if (ticket.getTicketStatus() != TicketStatus.APPROVED) {
        throw new RuntimeException("Satisfaction score can only be submitted for approved tickets");
    }

    // Prevent re-rating
    if (ticket.getSatisfactionScore() != null) {
        throw new RuntimeException("Satisfaction score already submitted");
    }

    ticket.setSatisfactionScore(score);
    ticket = ticketRepository.save(ticket);
    return mapToResponse(ticket);
}
}