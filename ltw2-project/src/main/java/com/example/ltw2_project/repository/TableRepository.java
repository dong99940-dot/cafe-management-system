package com.example.ltw2_project.repository;

import com.example.ltw2_project.model.TableEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends MongoRepository<TableEntity, String> {
    List<TableEntity> findByStatus(String status);
    TableEntity findByTableNumber(int tableNumber);
    
    boolean existsByReservedByAndStatusIn(String reservedBy, List<String> statuses);

    Optional<TableEntity> findFirstByReservedByAndStatusIn(String reservedBy, List<String> statuses);
}
