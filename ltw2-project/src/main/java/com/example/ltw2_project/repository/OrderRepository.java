package com.example.ltw2_project.repository;

import com.example.ltw2_project.model.OrderEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByTableNumber(int tableNumber);
    List<OrderEntity> findByStatus(String status);
    List<OrderEntity> findByCreatedAtBetween(Instant start, Instant end);
    Optional<OrderEntity> findByTableNumberAndStatusIn(int tableNumber, List<String> statuses);
}
