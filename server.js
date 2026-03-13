const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gift_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('请检查 .env 配置和 MySQL 服务状态');
    process.exit(1);
  }
}

// ==================== API 路由 ====================

// 1. 获取所有记录
app.get('/api/records', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM records ORDER BY date DESC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. 搜索记录
app.get('/api/records/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.json({ success: true, data: [] });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM records WHERE name LIKE ? OR occasion LIKE ? OR note LIKE ? ORDER BY date DESC, created_at DESC',
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. 获取单条记录
app.get('/api/records/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: '记录不存在' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. 创建记录（增）
app.post('/api/records', async (req, res) => {
  try {
    const { name, type, amount, date, occasion, note } = req.body;
    
    // 验证必填字段
    if (!name || !type || !amount || !date) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必填字段：姓名、类型、金额、日期' 
      });
    }
    
    // 验证类型
    if (!['give', 'receive'].includes(type)) {
      return res.status(400).json({ success: false, error: '类型必须是 give 或 receive' });
    }
    
    // 验证金额
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({ success: false, error: '金额必须是非负数' });
    }
    
    const [result] = await pool.query(
      `INSERT INTO records (name, type, amount, date, occasion, note) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, type, amountNum, date, occasion || null, note || null]
    );
    
    const [newRecord] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ success: true, data: newRecord[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. 更新记录（改）
app.put('/api/records/:id', async (req, res) => {
  try {
    const { name, type, amount, date, occasion, note } = req.body;
    const id = parseInt(req.params.id);
    
    // 检查记录是否存在
    const [existing] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: '记录不存在' });
    }
    
    // 验证必填字段
    if (!name || !type || !amount || !date) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必填字段：姓名、类型、金额、日期' 
      });
    }
    
    // 验证类型
    if (!['give', 'receive'].includes(type)) {
      return res.status(400).json({ success: false, error: '类型必须是 give 或 receive' });
    }
    
    // 验证金额
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({ success: false, error: '金额必须是非负数' });
    }
    
    await pool.query(
      `UPDATE records 
       SET name = ?, type = ?, amount = ?, date = ?, occasion = ?, note = ?
       WHERE id = ?`,
      [name, type, amountNum, date, occasion || null, note || null, id]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [id]
    );
    
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. 删除记录（删）
app.delete('/api/records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // 检查记录是否存在
    const [existing] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: '记录不存在' });
    }
    
    await pool.query('DELETE FROM records WHERE id = ?', [id]);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. 批量导入记录（导入）
app.post('/api/records/batch', async (req, res) => {
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records)) {
      return res.status(400).json({ success: false, error: '数据格式错误，需要 records 数组' });
    }
    
    if (records.length === 0) {
      return res.status(400).json({ success: false, error: '记录数组为空' });
    }
    
    // 验证每条记录
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r.name || !r.type || !r.amount || !r.date) {
        return res.status(400).json({ 
          success: false, 
          error: `第 ${i + 1} 条记录缺少必填字段` 
        });
      }
      if (!['give', 'receive'].includes(r.type)) {
        return res.status(400).json({ 
          success: false, 
          error: `第 ${i + 1} 条记录类型错误` 
        });
      }
    }
    
    // 批量插入
    const values = records.map(r => [
      r.name,
      r.type,
      parseFloat(r.amount),
      r.date,
      r.occasion || null,
      r.note || null
    ]);
    
    await pool.query(
      `INSERT INTO records (name, type, amount, date, occasion, note) 
       VALUES ?`,
      [values]
    );
    
    res.json({ 
      success: true, 
      message: `成功导入 ${records.length} 条记录`,
      count: records.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. 导出所有记录（导出）
app.get('/api/records/export', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM records ORDER BY date DESC'
    );
    
    // 导出为 JSON 格式
    const exportData = {
      exportTime: new Date().toISOString(),
      version: '1.0',
      totalRecords: rows.length,
      records: rows
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=gift-records-export.json');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. 获取统计数据
app.get('/api/stats', async (req, res) => {
  try {
    const [[totalStats]] = await pool.query(`
      SELECT 
        COUNT(*) as totalRecords,
        COALESCE(SUM(CASE WHEN type = 'give' THEN amount ELSE 0 END), 0) as totalGive,
        COALESCE(SUM(CASE WHEN type = 'receive' THEN amount ELSE 0 END), 0) as totalReceive
      FROM records
    `);
    
    const balance = totalStats.totalReceive - totalStats.totalGive;
    
    res.json({
      success: true,
      data: {
        totalRecords: totalStats.totalRecords,
        totalGive: parseFloat(totalStats.totalGive),
        totalReceive: parseFloat(totalStats.totalReceive),
        balance: parseFloat(balance)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. 获取某个人的往来汇总
app.get('/api/stats/:name', async (req, res) => {
  try {
    const name = req.params.name;
    
    const [[giveStats]] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as sum, COUNT(*) as count 
      FROM records 
      WHERE name = ? AND type = 'give'
    `, [name]);
    
    const [[receiveStats]] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as sum, COUNT(*) as count 
      FROM records 
      WHERE name = ? AND type = 'receive'
    `, [name]);
    
    res.json({
      success: true,
      data: {
        name,
        give: parseFloat(giveStats.sum),
        giveCount: giveStats.count,
        receive: parseFloat(receiveStats.sum),
        receiveCount: receiveStats.count,
        balance: parseFloat(receiveStats.sum - giveStats.sum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. 获取所有人名列表（用于下拉选择）
app.get('/api/names', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT name FROM records ORDER BY name'
    );
    res.json({ success: true, data: rows.map(r => r.name) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== 启动服务器 ====================

async function startServer() {
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📊 数据库：${process.env.DB_NAME || 'gift_tracker'}@${process.env.DB_HOST || 'localhost'}`);
    console.log(`\n📋 API 接口:`);
    console.log(`  GET    /api/records           - 获取所有记录`);
    console.log(`  GET    /api/records/search    - 搜索记录`);
    console.log(`  GET    /api/records/export    - 导出记录`);
    console.log(`  POST   /api/records           - 创建记录`);
    console.log(`  POST   /api/records/batch     - 批量导入`);
    console.log(`  PUT    /api/records/:id       - 更新记录`);
    console.log(`  DELETE /api/records/:id       - 删除记录`);
    console.log(`  GET    /api/stats             - 统计数据`);
    console.log(`  GET    /api/stats/:name       - 个人汇总`);
    console.log(`  GET    /api/names             - 人名列表`);
    console.log(`\n🌐 前端访问：http://localhost:${PORT}`);
  });
}

startServer();
