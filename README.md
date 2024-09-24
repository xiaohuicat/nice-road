# How to use
```shell
npm install nice-road
```

# example
your-project
1. main.js
2. setting.js

main.js
```javascript
const setting = require('./setting');
const { NiceRoad, multipleValidate, ruleBreak, ruleNext } = require('nice-road');
const road = new NiceRoad(setting);
road.setRule(rule);
road.initRouter('./src/router');
road.run(8080);

/**
 * 规则函数
 * @param rules 规则列表，在路由中配置的规则，如['GET']
 * @param option 配置参数，{token, method, jwt_key, rsa_private_pem}
 */
function rule(rules, option) {
  return multipleValidate([
    [rules.includes('GET') && option.method !== 'GET', '请求方法错误'],
    [rules.includes('POST') && option.method !== 'POST', '请求方法错误'],
    () => {
      if (rules.includes('user')) {
        // 执行用户校验， 如果失败，则返回 ruleBreak('用户校验失败')
        return ruleBreak('用户校验失败');
      }

      return ruleNext('验证通过');
    }
  ]);
}

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