package com.example.ltw2_project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "orders")
public class OrderEntity {

    @Id
    private String id;
    private int tableNumber;
    private String customerEmail;
    private List<OrderItem> items;     // Danh sách món
    private double totalPrice;
    private String status;             // NEW, COOKING, DONE
    private Instant createdAt;

    public OrderEntity() {}

    public OrderEntity(int tableNumber, String customerEmail, List<OrderItem> items,
                       double totalPrice, String status, Instant createdAt) {
        this.tableNumber = tableNumber;
        this.customerEmail = customerEmail;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public int getTableNumber() { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
