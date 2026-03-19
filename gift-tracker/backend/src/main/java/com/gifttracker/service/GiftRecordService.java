package com.gifttracker.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gifttracker.mapper.GiftRecordMapper;
import com.gifttracker.model.GiftRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GiftRecordService {
    
    private final GiftRecordMapper giftRecordMapper;
    
    public GiftRecordService(GiftRecordMapper giftRecordMapper) {
        this.giftRecordMapper = giftRecordMapper;
    }
    
    public List<GiftRecord> getAllByUserId(Long userId) {
        LambdaQueryWrapper<GiftRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(GiftRecord::getUserId, userId)
               .orderByDesc(GiftRecord::getCreateTime);
        return giftRecordMapper.selectList(wrapper);
    }
    
    public GiftRecord getById(Long id, Long userId) {
        GiftRecord record = giftRecordMapper.selectById(id);
        if (record != null && !record.getUserId().equals(userId)) {
            return null; // 无权访问
        }
        return record;
    }
    
    @Transactional
    public GiftRecord create(GiftRecord record, Long userId) {
        record.setUserId(userId);
        giftRecordMapper.insert(record);
        return record;
    }
    
    @Transactional
    public GiftRecord update(Long id, GiftRecord record, Long userId) {
        GiftRecord existing = getById(id, userId);
        if (existing == null) {
            return null;
        }
        
        existing.setType(record.getType());
        existing.setPersonName(record.getPersonName());
        existing.setEventType(record.getEventType());
        existing.setAmount(record.getAmount());
        existing.setDate(record.getDate());
        existing.setRemark(record.getRemark());
        
        giftRecordMapper.updateById(existing);
        return existing;
    }
    
    @Transactional
    public void delete(Long id, Long userId) {
        GiftRecord record = getById(id, userId);
        if (record != null) {
            giftRecordMapper.deleteById(id);
        }
    }
    
    public List<GiftRecord> getByPersonName(Long userId, String personName) {
        LambdaQueryWrapper<GiftRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(GiftRecord::getUserId, userId)
               .eq(GiftRecord::getPersonName, personName)
               .orderByDesc(GiftRecord::getCreateTime);
        return giftRecordMapper.selectList(wrapper);
    }
    
    public Map<String, Object> getStatistics(Long userId) {
        BigDecimal totalGive = giftRecordMapper.sumByUserIdAndType(userId, "GIVE");
        BigDecimal totalReceive = giftRecordMapper.sumByUserIdAndType(userId, "RECEIVE");
        
        if (totalGive == null) totalGive = BigDecimal.ZERO;
        if (totalReceive == null) totalReceive = BigDecimal.ZERO;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalGive", totalGive);
        stats.put("totalReceive", totalReceive);
        stats.put("netBalance", totalReceive.subtract(totalGive));
        
        List<Map<String, Object>> personBalances = giftRecordMapper.getPersonBalanceSummary(userId);
        stats.put("personBalances", personBalances);
        
        return stats;
    }
}
