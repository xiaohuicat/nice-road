const { applySetting } = require('nice-road');

const __DEV__ = true; //是否为开发环境
const VERSION = '0.0.1';
const JWT_KEY = 'nice-road-2024';

//配置链接数据库参数
const mysqlConfig = {
  host: '127.0.0.1',
  port: 1746, //端口号
  database: 'database', //数据库名
  username: 'root', //数据库用户名
  password: '***********', //数据库密码
  timezone: '+08:00', //设置时区
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
};

//配置静态资源路径
const staticPath = 'E://static';

applySetting({
  __DEV__,
  VERSION,
  JWT_KEY,
  mysqlConfig,
  staticPath
});
