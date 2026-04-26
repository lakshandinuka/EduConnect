package com.sfs.educonnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.sfs.educonnect.enums.Role;

@Data
public class RegisterRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String fullName;

    private String phoneNumber;

    @NotNull
    private Role role;

    // Only for students
    private String studentId;

    // Only for department admins
    private Long departmentId;
}
