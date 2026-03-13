// 数据库迁移脚本 - 添加 amount_type 字段
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateDatabase() {
  let connection;
  
  try {
    console.log('📦 连接到 MySQL 服务器...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('✅ MySQL 连接成功');
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // 检查字段是否存在
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM records LIKE 'amount_type'
    `);
    
    if (columns.length === 0) {
      console.log('📦 添加 amount_type 字段...');
      await connection.query(`
        ALTER TABLE records 
        ADD COLUMN amount_type VARCHAR(20) DEFAULT '其他' COMMENT '金额类型：上礼/小礼/其他'
        AFTER amount
      `);
      console.log('✅ amount_type 字段添加成功');
    } else {
      console.log('✅ amount_type 字段已存在');
    }
    
    console.log('\n🎉 数据库迁移完成！');
    
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateDatabase();
