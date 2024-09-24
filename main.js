const setting = require('./setting');
const { NiceRoad, multipleValidate, ruleBreak, ruleNext } = require('./core');
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
