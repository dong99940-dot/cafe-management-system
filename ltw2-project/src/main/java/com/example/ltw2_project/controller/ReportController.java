package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.OrderEntity;
import com.example.ltw2_project.repository.OrderRepository;
import com.example.ltw2_project.repository.TableRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final OrderRepository orderRepo;
    private final TableRepository tableRepo;

    public ReportController(OrderRepository orderRepo, TableRepository tableRepo) {
        this.orderRepo = orderRepo;
        this.tableRepo = tableRepo;
    }

    // 🔹 1. Thống kê trong ngày (today)
    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public Map<String, Object> getTodayReport() {
        Instant now = Instant.now();
        Instant startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<OrderEntity> todayOrders = orderRepo.findByCreatedAtBetween(startOfDay, now);

        double totalRevenue = todayOrders.stream()
                .filter(o -> "DONE".equals(o.getStatus()))
                .mapToDouble(OrderEntity::getTotalPrice)
                .sum();

        long totalOrders = todayOrders.size();

        long servedTables = tableRepo.findAll().stream()
                .filter(t -> !"TRONG".equals(t.getStatus()))
                .count();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("date", LocalDate.now().toString());
        report.put("totalRevenue", totalRevenue);
        report.put("totalOrders", totalOrders);
        report.put("servedTables", servedTables);
        report.put("customers", totalOrders); // 1 đơn hàng ≈ 1 lượt khách

        return report;
    }

    // 🔹 2. Thống kê trong tháng (month)
    @GetMapping("/month")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public Map<String, Object> getMonthlyReport() {
        LocalDate today = LocalDate.now();
        Instant startOfMonth = today.withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant now = Instant.now();

        List<OrderEntity> monthlyOrders = orderRepo.findByCreatedAtBetween(startOfMonth, now);

        double totalRevenue = monthlyOrders.stream()
                .filter(o -> "DONE".equals(o.getStatus()))
                .mapToDouble(OrderEntity::getTotalPrice)
                .sum();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("month", today.getMonth().toString());
        report.put("totalRevenue", totalRevenue);
        report.put("totalOrders", monthlyOrders.size());

        return report;
    }
}
