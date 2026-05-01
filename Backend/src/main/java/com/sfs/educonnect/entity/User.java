package com.sfs.educonnect.entity;

import com.sfs.educonnect.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // Compatibility with the JS KB project's users table if it already exists locally.
    @Column(name = "username", unique = true)
    private String legacyUsername;

    @Column(nullable = false)
    private String password;

    @Column(name = "password_hash")
    private String legacyPasswordHash;

    @Column(nullable = false)
    private String fullName;

    private String phoneNumber;

    // Only for students
    private String studentId;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Only for department admins
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @PrePersist
    @PreUpdate
    protected void syncLegacyColumns() {
        if (legacyUsername == null || legacyUsername.isBlank()) {
            legacyUsername = email;
        }
        if (legacyPasswordHash == null || legacyPasswordHash.isBlank()) {
            legacyPasswordHash = password;
        }
    }

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
