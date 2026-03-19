package com.gifttracker.controller;

import com.gifttracker.model.GiftRecord;
import com.gifttracker.service.GiftRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gifts")
@CrossOrigin(origins = "*")
public class GiftRecordController {
    
    private final GiftRecordService service;
    
    public GiftRecordController(GiftRecordService service) {
        this.service = service;
    }
    
    @GetMapping
    public List<GiftRecord> getAllRecords(@AuthenticationPrincipal Long userId) {
        return service.getAllByUserId(userId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GiftRecord> getRecordById(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        GiftRecord record = service.getById(id, userId);
        return record != null ? ResponseEntity.ok(record) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public GiftRecord createRecord(@RequestBody GiftRecord record, @AuthenticationPrincipal Long userId) {
        return service.create(record, userId);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GiftRecord> updateRecord(@PathVariable Long id, @RequestBody GiftRecord record, 
                                                    @AuthenticationPrincipal Long userId) {
        GiftRecord updated = service.update(id, record, userId);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        service.delete(id, userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/person/{name}")
    public List<GiftRecord> getByPersonName(@PathVariable String name, @AuthenticationPrincipal Long userId) {
        return service.getByPersonName(userId, name);
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getStatistics(@AuthenticationPrincipal Long userId) {
        return service.getStatistics(userId);
    }
}
