// 数据库初始化脚本
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    // 1. 连接到 MySQL 服务器（不指定数据库）
    console.log('📦 连接到 MySQL 服务器...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('✅ MySQL 连接成功');
    
    // 2. 创建数据库
    console.log('📦 创建数据库...');
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} 
      DEFAULT CHARACTER SET utf8mb4 
      DEFAULT COLLATE utf8mb4_unicode_ci
    `);
    console.log(`✅ 数据库 ${process.env.DB_NAME} 创建成功`);
    
    // 3. 切换到新数据库
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // 4. 创建记录表
    console.log('📦 创建数据表 records...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '姓名',
        type ENUM('give', 'receive') NOT NULL COMMENT '类型：give=送出，receive=收到',
        amount DECIMAL(10, 2) NOT NULL COMMENT '金额',
        date DATE NOT NULL COMMENT '日期',
        occasion VARCHAR(200) COMMENT '场合/事由',
        note TEXT COMMENT '备注',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX idx_name (name),
        INDEX idx_date (date),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='人情往来记录表'
    `);
    console.log('✅ 数据表 records 创建成功');
    
    console.log('\n🎉 数据库初始化完成！');
    console.log(`\n数据库信息:`);
    console.log(`  - 数据库名：${process.env.DB_NAME}`);
    console.log(`  - 主机：${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    console.log(`  - 用户：${process.env.DB_USER || 'root'}`);
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.error('\n请检查:');
    console.error('1. MySQL 服务是否已启动');
    console.error('2. .env 文件中的配置是否正确');
    console.error('3. MySQL 用户是否有创建数据库的权限');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行初始化
initDatabase();
