package com.gifttracker.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gifttracker.model.GiftRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Mapper
public interface GiftRecordMapper extends BaseMapper<GiftRecord> {
    
    @Select("SELECT SUM(amount) FROM gift_records WHERE user_id = #{userId} AND type = 'GIVE'")
    BigDecimal sumByUserIdAndType(Long userId, String type);
    
    @Select("SELECT person_name, SUM(CASE WHEN type = 'GIVE' THEN amount ELSE -amount END) as balance " +
            "FROM gift_records WHERE user_id = #{userId} GROUP BY person_name ORDER BY balance DESC")
    List<Map<String, Object>> getPersonBalanceSummary(Long userId);
    
    IPage<GiftRecord> selectByUserId(Page<GiftRecord> page, Long userId);
}
