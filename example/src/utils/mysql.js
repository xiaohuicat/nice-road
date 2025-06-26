var mysql = require('mysql');
var db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3360,
  user: 'root',
  password: '**********',
});

db.connect();

db.query(
  `CREATE DATABASE IF NOT EXISTS nice_app \
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;`,
  function (error, results, fields) {
    if (error) throw error;
    console.log('创建数据库');
    console.log(results);
  },
);

db.query('use nice_app;');

db.query(
  `CREATE TABLE IF NOT EXISTS users(
    id bigint(20) NOT NULL AUTO_INCREMENT,
    user_id bigint(20) NOT NULL,
    token varchar(100) NOT NULL,
    email varchar(50) NOT NULL,
    phone varchar(50) NOT NULL,
    name varchar(100) NOT NULL,
    avatar varchar(50) NULL,
    status int(10) NOT NULL,
    level int(10) NOT NULL,
    create_at datetime(3) DEFAULT NULL,
    update_at datetime(3) DEFAULT NULL,
    PRIMARY KEY (id)
  )ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`,
  function (error, results, fields) {
    if (error) throw error;
  },
);

db.end();
