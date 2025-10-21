package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.Feedback;
import com.example.ltw2_project.repository.FeedbackRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    private final FeedbackRepository feedbackRepo;

    public FeedbackController(FeedbackRepository feedbackRepo) {
        this.feedbackRepo = feedbackRepo;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Feedback createFeedback(@RequestBody Feedback f) {
        return feedbackRepo.save(f);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepo.findAll();
    }

    @PutMapping("/{id}/reply")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public Feedback replyToFeedback(@PathVariable String id, @RequestParam String reply) {
        Feedback f = feedbackRepo.findById(id).orElseThrow(() -> new RuntimeException("Feedback not found"));
        f.setAdminReply(reply);
        return feedbackRepo.save(f);
    }

    @GetMapping("/product/{productId}")
    public List<Feedback> getByProduct(@PathVariable String productId) {
        return feedbackRepo.findByProductId(productId);
    }
}
