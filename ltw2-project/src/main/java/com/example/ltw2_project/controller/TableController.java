package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.TableEntity;
import com.example.ltw2_project.repository.TableRepository;
import com.example.ltw2_project.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableRepository tableRepo;
    private final JwtUtil jwtUtil;

    public TableController(TableRepository tableRepo, JwtUtil jwtUtil) {
        this.tableRepo = tableRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public TableEntity createTable(@RequestBody TableEntity table) {
        if (tableRepo.findByTableNumber(table.getTableNumber()) != null) {
            throw new RuntimeException("Số bàn đã tồn tại");
        }
        table.setStatus("TRONG");
        return tableRepo.save(table);
    }

    @GetMapping
    public List<TableEntity> getAllTables() {
        return tableRepo.findAll();
    }

    @GetMapping("/available")
    public List<TableEntity> getAvailableTables() {
        return tableRepo.findByStatus("TRONG");
    }

    @PutMapping("/reserve/{tableNumber}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> reserveTable(
            @PathVariable int tableNumber,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.getSubject(token);

        boolean hasActive = tableRepo.existsByReservedByAndStatusIn(
                email, List.of("PHUC_VU", "DANG_SU_DUNG"));
        if (hasActive) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Bạn đang có bàn đang phục vụ, không thể đặt thêm."));
        }

        TableEntity table = tableRepo.findByTableNumber(tableNumber);
        if (table == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy bàn"));
        }
        if (!"TRONG".equals(table.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Bàn đã có khách hoặc đang phục vụ"));
        }

        table.setStatus("PHUC_VU");
        table.setReservedBy(email);
        tableRepo.save(table);

        return ResponseEntity.ok(table);
    }

    @PutMapping("/update-status/{tableNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<?> updateStatus(
            @PathVariable int tableNumber,
            @RequestParam String status) {

        TableEntity table = tableRepo.findByTableNumber(tableNumber);
        if (table == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy bàn"));
        }

        table.setStatus(status);
        if ("DA_THANH_TOAN".equals(status)) {
            table.setReservedBy(null); 
        }
        tableRepo.save(table);

        return ResponseEntity.ok(table);
    }

    @DeleteMapping("/{tableNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<?> deleteTable(@PathVariable int tableNumber) {
        TableEntity table = tableRepo.findByTableNumber(tableNumber);
        if (table == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy bàn"));
        }
        tableRepo.delete(table);
        return ResponseEntity.ok(Map.of("message", "Đã xoá bàn số " + tableNumber));
    }
    
    @GetMapping("/my-active")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyActiveTable(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.getSubject(token);

        var table = tableRepo.findFirstByReservedByAndStatusIn(
                email, List.of("PHUC_VU", "DANG_SU_DUNG")).orElse(null);

        return ResponseEntity.ok(table);
    }
}
