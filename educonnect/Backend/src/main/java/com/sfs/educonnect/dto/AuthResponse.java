package com.sfs.educonnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.sfs.educonnect.enums.Role;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Long departmentId; // null if not dept admin
}
