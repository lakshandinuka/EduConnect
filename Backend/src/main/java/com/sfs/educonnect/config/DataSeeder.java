package com.sfs.educonnect.config;

import com.sfs.educonnect.entity.*;
import com.sfs.educonnect.enums.FaqStatus;
import com.sfs.educonnect.enums.KbItemStatus;
import com.sfs.educonnect.enums.KbItemType;
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
        private final CategoryRepository categoryRepository;
        private final PolicyRepository policyRepository;
        private final KbItemRepository kbItemRepository;
        private final FaqRepository faqRepository;

        @SuppressWarnings("null")
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
                seedKnowledgeBase();
        }

        private void seedKnowledgeBase() {
                Category general = seedCategory("General", "General help and guidance");
                Category academic = seedCategory("Academic", "Academic calendars, registration, and course guidance");
                Category assignments = seedCategory("Assignments", "Assignment submission and grading support");
                Category technical = seedCategory("Technical", "Account, email, Wi-Fi, and portal troubleshooting");
                Category exams = seedCategory("Exams", "Exam schedules, preparation, and regulations");
                Category library = seedCategory("Library", "Library access, databases, and study resources");
                seedCategory("Student Services", "Financial aid, wellbeing, and campus services");

                Policy publicAccess = seedPolicy("Public Access", "Accessible by all users", "PUBLIC", "globe");
                seedPolicy("Staff Only", "Accessible by staff and administrators", "STAFF_ONLY", "lock");
                seedPolicy("Department Admin", "Accessible by department administrators", "DEPT_ADMIN", "building");

                seedFaq("How do I submit an assignment?",
                                "Open your course page, choose the assignment, upload the requested file, and confirm the submission receipt.",
                                assignments.getName(),
                                10);
                seedFaq("Where can I reset my portal password?",
                                "Use the password reset link on the login page. If your recovery email is not available, contact technical support.",
                                technical.getName(),
                                20);
                seedFaq("When are exam timetables published?",
                                "Exam timetables are usually published by the academic office before the exam period and updated if room allocations change.",
                                exams.getName(),
                                30);

                seedKbItem("Course Registration Guide",
                                "Step-by-step guidance for planning and registering for courses.",
                                academic,
                                publicAccess,
                                "<h2>Course Registration</h2><p>Review your degree requirements, meet your advisor, choose eligible courses, and submit your registration before the deadline.</p><h3>Before you register</h3><ul><li>Check prerequisites.</li><li>Confirm timetable conflicts.</li><li>Review account holds.</li></ul>",
                                true,
                                true);
                seedKbItem("Student Email Setup Guide",
                                "How to activate and configure your student email account.",
                                technical,
                                publicAccess,
                                "<h2>Student Email Setup</h2><p>Activate your account from the portal, set a secure password, and use your official email for university communication.</p><h3>Troubleshooting</h3><p>If activation fails, verify your student ID and contact technical support.</p>",
                                true,
                                true);
                seedKbItem("Library Access and Resources",
                                "Guide to library access, online databases, and study spaces.",
                                library,
                                publicAccess,
                                "<h2>Library Resources</h2><p>Use your student credentials to access physical library spaces, online databases, journals, and research support.</p><h3>Study spaces</h3><p>Individual and group spaces may require booking during peak periods.</p>",
                                false,
                                true);
                seedKbItem("Exam Preparation Checklist",
                                "A practical checklist for exam preparation and exam-day readiness.",
                                exams,
                                publicAccess,
                                "<h2>Exam Preparation</h2><p>Confirm your timetable, revise against learning outcomes, prepare identification, and arrive early for each exam.</p>",
                                true,
                                false);
                seedKbItem("General Student Support",
                                "A starting point for finding support channels across SFS Academy.",
                                general,
                                publicAccess,
                                "<h2>Student Support</h2><p>Use EDUConnect to browse help articles, read FAQs, and submit tickets when you need direct help.</p>",
                                false,
                                false);
        }

        private Category seedCategory(String name, String description) {
                Category category = categoryRepository.findByName(name).orElseGet(Category::new);
                category.setName(name);
                category.setDescription(description);
                return categoryRepository.save(category);
        }

        private Policy seedPolicy(String name, String description, String rules, String icon) {
                Policy policy = policyRepository.findByName(name).orElseGet(Policy::new);
                policy.setName(name);
                policy.setDescription(description);
                policy.setRules(rules);
                policy.setIcon(icon);
                return policyRepository.save(policy);
        }

        private void seedFaq(String question, String answer, String category, int sortOrder) {
                Faq faq = faqRepository.findFirstByQuestion(question).orElseGet(Faq::new);
                faq.setQuestion(question);
                faq.setAnswer(answer);
                faq.setCategory(category);
                faq.setStatus(FaqStatus.PUBLISHED);
                faq.setSortOrder(sortOrder);
                faqRepository.save(faq);
        }

        private void seedKbItem(
                        String title,
                        String description,
                        Category category,
                        Policy policy,
                        String content,
                        boolean featured,
                        boolean recommended) {
                KbItem item = kbItemRepository.findFirstByTitle(title).orElseGet(KbItem::new);
                item.setTitle(title);
                item.setDescription(description);
                item.setType(KbItemType.ARTICLE);
                item.setStatus(KbItemStatus.PUBLISHED);
                item.setCategory(category);
                item.setPolicy(policy);
                item.setContent(content);
                item.setPdfUrl("");
                item.setFeatured(featured);
                item.setRecommended(recommended);
                kbItemRepository.save(item);
        }
}
