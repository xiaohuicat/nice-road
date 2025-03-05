# How to use
```shell
npm install nice-road
```

# example
your-project
1. main.js
2. setting.js
3. src/router

### main.js
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
      if (rules.includes('USER')) {
        // 执行用户校验， 如果失败，则返回 ruleBreak('用户校验失败')
        return ruleBreak('用户校验失败');
      }

      return ruleNext('验证通过');
    }
  ]);
}

```
### setting.js
```javascript
const { applySetting } = require("nice-road");
//配置静态资源路径
const staticPath = 'E://static';

//配置链接数据库参数
const mysqlConfig = {
  host: '127.0.0.1',
  port: 3360,              //端口号
  database: 'database',    //数据库名
  username: 'root',        //数据库用户名
  password: '***********', //数据库密码
  timezone: '+08:00'       //设置时区
};

applySetting({
  staticPath,
  mysqlConfig,
});
```

### router文件夹 src/router/***.js
```javascript
/**
 * router文件夹下面可以创建多个文件，每个文件按如下格式编写
 * 引入npath函数创建路由
 * @returns {urls: Array, rules: Array}
 * */

const { npath } = require('nice-road');

function getUserAvatar(req, res) {
  res.sendFile('C:/Users/admin/Desktop/avatar.jpg');
}

function getUserList(req, res) {
  res.send('your can get userList');
}

// 全局规则
const rules = ['GET'];
// 路由配置
const urls = [
  // 不设置规则，则使用全局规则
  npath('/getUserAvatar', getUserAvatar),
  // 使用设置的规则
  npath('/getUserList', getUserList, ['POST', 'USER'])
];

module.exports = {
  urls,
  rules
};
```