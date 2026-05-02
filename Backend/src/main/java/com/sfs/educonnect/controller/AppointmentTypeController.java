package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.AppointmentType;
import com.sfs.educonnect.repository.AppointmentTypeRepository;
import com.sfs.educonnect.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/types")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AppointmentTypeController {

    private final AppointmentTypeRepository typeRepository;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<AppointmentType>> getAllTypes() {
        return ResponseEntity.ok(typeRepository.findAll());
    }

    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<?> createType(@RequestBody Map<String, Object> payload) {
        AppointmentType type = new AppointmentType();
        type.setTitle((String) payload.get("title"));
        type.setDuration(Integer.valueOf(payload.get("duration").toString()));
        type.setStatus(payload.getOrDefault("status", "Active").toString());

        Long deptId = Long.valueOf(payload.get("departmentId").toString());
        type.setDepartment(departmentRepository.findById(deptId).orElseThrow());

        return ResponseEntity.ok(typeRepository.save(type));
    }

    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateType(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        @SuppressWarnings("null")
        AppointmentType type = typeRepository.findById(id).orElseThrow();

        if (payload.containsKey("title"))
            type.setTitle((String) payload.get("title"));
        if (payload.containsKey("duration"))
            type.setDuration(Integer.valueOf(payload.get("duration").toString()));
        if (payload.containsKey("status"))
            type.setStatus((String) payload.get("status"));

        if (payload.containsKey("departmentId")) {
            Long deptId = Long.valueOf(payload.get("departmentId").toString());
            type.setDepartment(departmentRepository.findById(deptId).orElseThrow());
        }

        return ResponseEntity.ok(typeRepository.save(type));
    }

    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteType(@PathVariable Long id) {
        typeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
