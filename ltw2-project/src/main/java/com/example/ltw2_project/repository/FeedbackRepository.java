package com.example.ltw2_project.repository;

import com.example.ltw2_project.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByProductId(String productId);
}
