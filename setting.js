const { createStaticPath } = require('./core');

const __DEV__ = true; //是否为开发环境
const verison = '0.0.1';

//配置链接数据库参数
const mysql_config = {
  host: '127.0.0.1',
  port: 1746, //端口号
  database: 'database', //数据库名
  username: 'root', //数据库用户名
  password: '***********', //数据库密码
  timezone: '+08:00' //设置时区
};

//配置静态资源路径
const staticPath = createStaticPath('E://static');

module.exports = {
  __DEV__,
  mysql_config,
  verison,
  staticPath
};
