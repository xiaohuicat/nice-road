# How to use
```shell
npm install nice-road
```

# example
your-project
--main.js
--setting.js

main.js
```javascript
const setting = require('./setting');
const { NiceRoad } = require('nice-road');
const road = new NiceRoad(setting);
road.initRouter('./src/router');
road.run(8080);
```
setting.js
```javascript
const { createStaticPath } = require("nice-road");
//配置静态资源路径
const staticPath = createStaticPath('E://static');

//配置链接数据库参数
const mysql_config = {
  host: '127.0.0.1',
  port: 1746,              //端口号
  database: 'database',    //数据库名
  username: 'root',        //数据库用户名
  password: '***********', //数据库密码
  timezone: '+08:00'       //设置时区
};

module.exports = {
  mysql_config,
  verison,
  staticPath,
};
```