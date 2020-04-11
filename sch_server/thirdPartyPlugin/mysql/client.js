//mysql的配置文件
const mysql = require('mysql')
const client = (sql, arg, callback) => {
  //1.创建连接
  let config = mysql.createConnection({
    host: 'localhost',
    user: 'root',
	password: 'root',
    /* password: 'qwer1234', */
    database: 'school_secondhand'
  })
  //2.开始连接
  config.connect()
  //3.对数据库进行增删查改
  config.query(sql, arg, (err, data) => {
    callback && callback(err, data)
  })
  //4.关闭数据库
  config.end()
}

module.exports = client;