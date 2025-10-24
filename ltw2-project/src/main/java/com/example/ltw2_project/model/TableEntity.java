package com.example.ltw2_project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tables")
public class TableEntity {

    @Id
    private String id;
    private int tableNumber;
    private String status;
    private int capacity;
    private String reservedBy;

    public TableEntity() {
    }

    public TableEntity(int tableNumber, String status, int capacity, String reservedBy) {
        this.tableNumber = tableNumber;
        this.status = status;
        this.capacity = capacity;
        this.reservedBy = reservedBy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public int getTableNumber() { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getReservedBy() { return reservedBy; }
    public void setReservedBy(String reservedBy) { this.reservedBy = reservedBy; }
}
