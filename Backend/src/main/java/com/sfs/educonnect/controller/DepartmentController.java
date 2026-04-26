package com.sfs.educonnect.controller;

import com.sfs.educonnect.dto.DepartmentDto;
import com.sfs.educonnect.entity.Department;
import com.sfs.educonnect.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        // Map each Department entity to a DepartmentDto
        return departments.stream()
                .map(dept -> new DepartmentDto(dept.getId(), dept.getName()))
                .collect(Collectors.toList());
    }
}