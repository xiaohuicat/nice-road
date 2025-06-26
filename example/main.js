const { setting } = require('./setting');
const { NiceRoad, multipleValidate, ruleBreak, ruleNext } = require('nice-road');
const road = new NiceRoad(setting);
// 添加校验规则
road.addRule(rule);
// 自动读取router文件夹下的所有文件
road.initRouter('./example/router');
road.run(8080);

/**
 * 规则函数
 * @param rules 规则列表，在路由中配置的规则，如['GET']
 * @param option 配置参数，{token, method, jwt_key, rsa_private_pem}
 * @returns {Object} 校验结果
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
    },
  ]);
}
