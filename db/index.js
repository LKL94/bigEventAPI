// 连接数据库模块
const mysql = require('mysql');

// 创建连接
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'my_db_02'
});

// 向外共享 db 数据库连接对象
module.exports = db;