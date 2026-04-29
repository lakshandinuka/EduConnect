package com.sfs.educonnect.service;

import com.sfs.educonnect.dto.AuthResponse;
import com.sfs.educonnect.dto.LoginRequest;
import com.sfs.educonnect.dto.RegisterRequest;
import com.sfs.educonnect.entity.Admin;
import com.sfs.educonnect.entity.Department;
import com.sfs.educonnect.entity.User;
import com.sfs.educonnect.enums.Role;
import com.sfs.educonnect.repository.DepartmentRepository;
import com.sfs.educonnect.repository.AdminRepository;
import com.sfs.educonnect.repository.UserRepository;
import com.sfs.educonnect.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminRepository adminRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());

        // Role specific fields
        if (request.getRole() == Role.STUDENT) {
            if (request.getStudentId() == null || request.getStudentId().isBlank()) {
                throw new RuntimeException("Student ID is required for students");
            }
            user.setStudentId(request.getStudentId());
        } else if (request.getRole() == Role.DEPT_ADMIN) {
            if (request.getDepartmentId() == null) {
                throw new RuntimeException("Department is required for department admin");
            }
            @SuppressWarnings("null")
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(dept);
        } else if (request.getRole() == Role.SUPER_ADMIN) {
            // No extra fields
        }

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user, user.getId(), user.getRole().name(),
                user.getDepartment() != null ? user.getDepartment().getId() : null);

        return new AuthResponse(token, "Bearer", user.getId(), user.getEmail(),
                user.getFullName(), user.getRole(),
                user.getDepartment() != null ? user.getDepartment().getId() : null);
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Try to find in User table (BCrypt)
        java.util.Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user, user.getId(), user.getRole().name(),
                        user.getDepartment() != null ? user.getDepartment().getId() : null);
                return new AuthResponse(token, "Bearer", user.getId(), user.getEmail(),
                        user.getFullName(), user.getRole(),
                        user.getDepartment() != null ? user.getDepartment().getId() : null);
            }
        }

        // 2. Try to find in Admin table (Plain Text)
        java.util.Optional<Admin> adminOpt = adminRepository.findByUsername(request.getEmail());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (request.getPassword().equals(admin.getPassword())) {
                // Admin role is "ADMIN"
                String token = jwtUtil.generateToken(admin, admin.getId(), "ADMIN", null);
                return new AuthResponse(token, "Bearer", admin.getId(), admin.getUsername(),
                        "Admin", Role.ADMIN, null);
            }
        }

        throw new RuntimeException("Invalid email or password");
    }
}