package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.OrderEntity;
import com.example.ltw2_project.model.OrderItem;
import com.example.ltw2_project.model.Product;
import com.example.ltw2_project.repository.OrderRepository;
import com.example.ltw2_project.repository.ProductRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public OrderController(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public OrderEntity createOrder(@RequestBody OrderEntity order) {
        double total = 0.0;
        for (OrderItem item : order.getItems()) {
            Product p = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + item.getProductId()));
            item.setName(p.getName());
            item.setPrice(p.getPrice());
            total += p.getPrice() * item.getQuantity();
        }
        order.setTotalPrice(total);
        order.setStatus("NEW");
        order.setCreatedAt(Instant.now());
        return orderRepo.save(order);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public List<OrderEntity> getAll() {
        return orderRepo.findAll();
    }

    @GetMapping("/table/{tableNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public List<OrderEntity> getByTable(@PathVariable int tableNumber) {
        return orderRepo.findByTableNumber(tableNumber);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public OrderEntity updateStatus(@PathVariable String id, @RequestParam String status) {
        OrderEntity order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus(status);
        return orderRepo.save(order);
    }

    @GetMapping("/stats/today")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public double getTodayRevenue() {
        Instant start = Instant.now().minusSeconds(86400); // 24h gần nhất
        Instant end = Instant.now();
        List<OrderEntity> orders = orderRepo.findByCreatedAtBetween(start, end);
        return orders.stream()
                .filter(o -> "DONE".equals(o.getStatus()))
                .mapToDouble(OrderEntity::getTotalPrice)
                .sum();
    }

    @GetMapping("/table/{tableNumber}/active")
    @PreAuthorize("hasRole('USER')")
    public OrderEntity getActiveOrderByTable(@PathVariable int tableNumber) {
        return orderRepo.findByTableNumberAndStatusIn(
                tableNumber, List.of("NEW", "PREPARING", "SERVING"))
                .orElse(null);
    }

    @PutMapping("/{id}/add-items")
    @PreAuthorize("hasRole('USER')")
    public OrderEntity addItemsToOrder(@PathVariable String id, @RequestBody List<OrderItem> newItems) {
        OrderEntity order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        double total = order.getTotalPrice();
        for (OrderItem item : newItems) {
            Product p = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + item.getProductId()));
            item.setName(p.getName());
            item.setPrice(p.getPrice());
            order.getItems().add(item);
            total += p.getPrice() * item.getQuantity();
        }
        order.setTotalPrice(total);
        return orderRepo.save(order);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('USER')")
    public List<OrderEntity> getMyOrders(@RequestParam String email) {
        return orderRepo.findByCustomerEmailOrderByCreatedAtDesc(email);
    }

}
