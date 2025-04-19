const { getSetting } = require('./setting');
const { safeRunCallback } = require('./utils');

/**
 * 路由类
 */
class Router {
  constructor(url, callback, rules) {
    this.url = url;
    this.callback = callback;
    this.rules = rules;
  }

  async run(req, res, rule) {
    // 错误的路由
    if (!this.url || !this.callback) {
      console.error(`[warning]错误的路由`);
      return;
    }

    const {__DEV__, JWT_KEY, PRIVATE_PEM} = getSetting();
    // 没有校验规则
    if (!this.rules) {
      const { status, msg } = await safeRunCallback(this.callback, req, res);
      if (!status) {
        res.send({ status: false, msg: __DEV__ ? msg : '发生错误！' });
      }

      return;
    }

    // 验证规则
    const option = {
      token: req.getToken(),
      method: req.getMethod(),
      jwt_key: JWT_KEY,
      rsa_private_pem: PRIVATE_PEM,
    };

    let ret = await rule(this.rules, option);
    if (ret?.fail) {
      res.send({ status: false, msg: ret?.msg || 'verify error' });
      return;
    }

    req.ruleResult = ret;
    const { status, msg } = await safeRunCallback(this.callback, req, res);
    if (!status) {
      res.send({ status: false, msg: __DEV__ ? msg : '发生错误！' });
    }
  }
}

/**
 * 创建路由对象
 * @param {String} url 路径
 * @param {Function} callback 回调函数
 * @param {Array} rules 权限规则
 * @returns {Router}
 */
function npath(url, callback, rules) {
  const {__DEV__, URL_PREFIX} = getSetting();
  if (url.startsWith('[hard]')) {
    const newUrl = url.replace('[hard]', '');
    if (__DEV__) console.log(`[info]注册路由：${newUrl}`);
    return new Router(newUrl, callback, rules);
  }
  
  const newUrl = URL_PREFIX + url;
  if (__DEV__) console.log(`[info]注册路由：${newUrl}`);
  return new Router(newUrl, callback, rules);
}

module.exports = {
  Router,
  npath,
};
