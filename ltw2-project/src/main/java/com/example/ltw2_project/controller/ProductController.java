package com.example.ltw2_project.controller;

import com.example.ltw2_project.model.Product;
import com.example.ltw2_project.repository.ProductRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    // 🔹 1. Lấy tất cả sản phẩm (ai cũng xem được)
    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    // 🔹 2. Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public Optional<Product> getById(@PathVariable String id) {
        return repo.findById(id);
    }

    // 🔹 3. Lọc theo loại (drink/food)
    @GetMapping("/category/{cat}")
    public List<Product> byCategory(@PathVariable String cat) {
        return repo.findByCategory(cat);
    }

    // 🔹 4. Tìm theo tên
    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return repo.findByNameContainingIgnoreCase(q);
    }

    // 🔹 5. Thêm sản phẩm (chỉ ADMIN hoặc ROOT)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public Product add(@RequestBody Product p) {
        p.setAvailable(true);
        return repo.save(p);
    }

    // 🔹 6. Cập nhật sản phẩm
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public Product update(@PathVariable String id, @RequestBody Product p) {
        Product existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        existing.setName(p.getName());
        existing.setCategory(p.getCategory());
        existing.setPrice(p.getPrice());
        existing.setImageUrl(p.getImageUrl());
        existing.setAvailable(p.isAvailable());
        return repo.save(existing);
    }

    // 🔹 7. Xoá sản phẩm
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public String delete(@PathVariable String id) {
        repo.deleteById(id);
        return "Đã xoá sản phẩm " + id;
    }
}
